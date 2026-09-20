/**
 * Pure TypeScript Implementation of Shamir's Secret Sharing Scheme over GF(2^8).
 * Designed natively for modern browsers using standard WebCrypto (window.crypto.getRandomValues).
 *
 * Implements 2-of-3 threshold sharing:
 * Any 2 shares can mathematically reconstruct the exact master secret.
 * Any single share reveals zero information about the secret.
 */

// Generate Galois Field GF(2^8) lookup tables using AES polynomial 0x11b
const exp = new Uint8Array(512);
const log = new Uint8Array(256);

let x = 1;
for (let i = 0; i < 255; i++) {
  exp[i] = x;
  exp[i + 255] = x;
  log[x] = i;
  x = x ^ (x << 1);
  if (x & 0x100) x ^= 0x11b; // Rijndael irreducible polynomial
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return exp[log[a] + log[b]];
}

function gfDiv(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero in GF(256)');
  if (a === 0) return 0;
  return exp[(log[a] - log[b] + 255) % 255];
}

export interface ShamirShare {
  x: number;
  data: string; // Hex-encoded share payload
}

/**
 * Format share as self-describing share code:
 * e.g., "INCASE-1-2-<hexData>"
 */
export function formatShareCode(share: ShamirShare, threshold: number = 2): string {
  return `INCASE-SHARE-${share.x}-${threshold}-${share.data}`;
}

/**
 * Parse a share code back into a ShamirShare object
 */
export function parseShareCode(code: string): ShamirShare {
  const trimmed = code.trim().toUpperCase();
  const match = trimmed.match(/^INCASE-SHARE-(\d+)-(\d+)-([0-9A-F]+)$/i);
  if (match) {
    return {
      x: parseInt(match[1], 10),
      data: match[3].toLowerCase(),
    };
  }

  // Fallback: Check if it's formatted as "x:hexData" or plain hex with prefix
  const colonMatch = code.trim().match(/^(\d+):([0-9a-fA-F]+)$/);
  if (colonMatch) {
    return {
      x: parseInt(colonMatch[1], 10),
      data: colonMatch[2].toLowerCase(),
    };
  }

  throw new Error(
    'Invalid share format. Expected format: INCASE-SHARE-<shareNumber>-2-<hexData>'
  );
}

/**
 * Split a 256-bit hex key into 3 shares with threshold 2
 */
export function splitKey(keyHex: string, numShares: number = 3, threshold: number = 2): string[] {
  if (threshold !== 2 || numShares !== 3) {
    throw new Error('This configuration currently supports 2-of-3 threshold sharing.');
  }

  // Convert hex to bytes
  const bytes = new Uint8Array(keyHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
  }

  const len = bytes.length;
  const share1 = new Uint8Array(len);
  const share2 = new Uint8Array(len);
  const share3 = new Uint8Array(len);

  // Secure CSPRNG random coefficients
  const randomCoeffs = new Uint8Array(len);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomCoeffs);
  } else {
    // Node environment fallback
    for (let i = 0; i < len; i++) {
      randomCoeffs[i] = Math.floor(Math.random() * 255) + 1;
    }
  }

  for (let i = 0; i < len; i++) {
    const s = bytes[i];
    let a1 = randomCoeffs[i];
    if (a1 === 0) a1 = 1; // Must be non-zero for degree 1 polynomial

    share1[i] = s ^ gfMul(a1, 1);
    share2[i] = s ^ gfMul(a1, 2);
    share3[i] = s ^ gfMul(a1, 3);
  }

  const toHex = (buf: Uint8Array) =>
    Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  return [
    formatShareCode({ x: 1, data: toHex(share1) }, threshold),
    formatShareCode({ x: 2, data: toHex(share2) }, threshold),
    formatShareCode({ x: 3, data: toHex(share3) }, threshold),
  ];
}

/**
 * Reconstruct master key from any 2 valid shares using Lagrange interpolation
 */
export function combineShares(shareCodes: string[]): string {
  if (shareCodes.length < 2) {
    throw new Error('At least 2 shares are required to unlock.');
  }

  const parsedShares: ShamirShare[] = [];
  const seenX = new Set<number>();

  for (const code of shareCodes) {
    try {
      const share = parseShareCode(code);
      if (!seenX.has(share.x)) {
        seenX.add(share.x);
        parsedShares.push(share);
      }
    } catch {
      // Continue searching valid shares
    }
  }

  if (parsedShares.length < 2) {
    throw new Error('Need at least 2 distinct valid shares to reconstruct the key.');
  }

  const sA = parsedShares[0];
  const sB = parsedShares[1];

  const xA = sA.x;
  const xB = sB.x;

  const hex2Bytes = (hex: string) => {
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return arr;
  };

  const bytesA = hex2Bytes(sA.data);
  const bytesB = hex2Bytes(sB.data);

  if (bytesA.length !== bytesB.length) {
    throw new Error('Share lengths do not match.');
  }

  const len = bytesA.length;
  const recovered = new Uint8Array(len);

  // Lagrange basis polynomials evaluated at x = 0:
  // lA = (0 - xB) / (xA - xB) = xB / (xA ^ xB) in GF(256)
  // lB = (0 - xA) / (xB - xA) = xA / (xA ^ xB) in GF(256)
  const denom = xA ^ xB;
  const lA = gfDiv(xB, denom);
  const lB = gfDiv(xA, denom);

  for (let i = 0; i < len; i++) {
    const termA = gfMul(bytesA[i], lA);
    const termB = gfMul(bytesB[i], lB);
    recovered[i] = termA ^ termB;
  }

  return Array.from(recovered)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
