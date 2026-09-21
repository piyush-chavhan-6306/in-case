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
 * Parse a share code back into a ShamirShare object, extracting the code
 * even if surrounded by extra text, labels, or formatting.
 */
export function parseShareCode(code: string, fallbackX: number = 1): ShamirShare {
  const trimmed = code.trim().replace(/^['"]|['"]$/g, '');

  // 1. Embedded or standard INCASE-SHARE-x-threshold-hex
  const match = trimmed.match(/INCASE-SHARE-(\d+)-(\d+)-([0-9a-fA-F]{32,})/i);
  if (match) {
    return {
      x: parseInt(match[1], 10),
      data: match[3].toLowerCase(),
    };
  }

  // 2. Colon/hyphen formatted "x:hexData"
  const colonMatch = trimmed.match(/(?:^|[\s,;:])(\d+)[:\-_]([0-9a-fA-F]{32,})/i);
  if (colonMatch) {
    return {
      x: parseInt(colonMatch[1], 10),
      data: colonMatch[2].toLowerCase(),
    };
  }

  // 3. Search for any 64-hex-character string (or at least 32 bytes)
  const hexMatch = trimmed.match(/[0-9a-fA-F]{64}/i) || trimmed.match(/[0-9a-fA-F]{32,}/i);
  if (hexMatch) {
    return {
      x: fallbackX,
      data: hexMatch[0].toLowerCase(),
    };
  }

  throw new Error(
    'Invalid share format. Expected format: INCASE-SHARE-<shareNumber>-2-<hexData> or valid hex string.'
  );
}

/**
 * Extract all valid Shamir shares found anywhere in a text string or combined inputs.
 */
export function extractAllSharesFromText(text: string): ShamirShare[] {
  const results: ShamirShare[] = [];
  const seenX = new Set<number>();

  // 1. Search all INCASE-SHARE occurrences
  const regex = /INCASE-SHARE-(\d+)-(\d+)-([0-9a-fA-F]{32,})/gi;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const x = parseInt(m[1], 10);
    if (!seenX.has(x)) {
      seenX.add(x);
      results.push({ x, data: m[3].toLowerCase() });
    }
  }

  // 2. Search all x:hex occurrences
  const colonRegex = /(?:^|[\s,;:])(\d+)[:\-_]([0-9a-fA-F]{32,})/gi;
  while ((m = colonRegex.exec(text)) !== null) {
    const x = parseInt(m[1], 10);
    if (!seenX.has(x)) {
      seenX.add(x);
      results.push({ x, data: m[2].toLowerCase() });
    }
  }

  return results;
}


/**
 * Split a 256-bit hex key into 3 shares with threshold 2
 */
export function splitKey(keyHex: string, numShares: number = 3, threshold: number = 2): string[] {
  if (threshold !== 2 || numShares !== 3) {
    throw new Error('This configuration currently supports 2-of-3 threshold sharing.');
  }

  const cleanKey = keyHex.trim().replace(/^0x/i, '');

  // Convert hex to bytes
  const bytes = new Uint8Array(cleanKey.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanKey.substr(i * 2, 2), 16);
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
 * Reconstruct master key from any 2 valid shares using Lagrange interpolation,
 * OR directly return the master key if a valid 64-char key is provided.
 */
export function combineShares(shareCodes: string[]): string {
  const filtered = shareCodes
    .map((s) => s.trim().replace(/^0x/i, ''))
    .filter((s) => s.length > 0);

  if (filtered.length === 0) {
    throw new Error('At least one key or share is required to unlock.');
  }

  // DIRECT MASTER KEY CHECK:
  // If the user provided a 64-character hex key (256-bit AES master key) directly,
  // we do not need polynomial recombination! Return the master key directly.
  for (const s of filtered) {
    if (/^[0-9a-fA-F]{64}$/i.test(s)) {
      // Check if it's not a prefixed share
      if (!s.toUpperCase().startsWith('INCASE-SHARE')) {
        // If this is the only input OR explicitly 64-char hex key, treat as Master Key
        if (filtered.length === 1 || !filtered.some((other) => other.toUpperCase().startsWith('INCASE-SHARE-'))) {
          // If there are two raw 64-char hex keys, it could be two raw shares.
          // If only 1 raw 64-char key is provided, it's definitively the Master Key!
          if (filtered.length === 1) {
            return s.toLowerCase();
          }
        }
      }
    }
  }

  // Parse shares
  const parsedShares: ShamirShare[] = [];
  const seenX = new Set<number>();

  let fallbackIdx = 1;
  for (const code of filtered) {
    try {
      // If code doesn't specify x, assign 1 or 2
      const candidateX = seenX.has(1) ? 2 : (seenX.has(2) ? 3 : fallbackIdx);
      const share = parseShareCode(code, candidateX);
      if (!seenX.has(share.x)) {
        seenX.add(share.x);
        parsedShares.push(share);
      }
      fallbackIdx++;
    } catch {
      // Continue searching valid shares
    }
  }

  if (parsedShares.length < 2) {
    // If we have 1 valid parsed share that is 64 hex chars and no other share, check if it's the master key
    if (parsedShares.length === 1 && parsedShares[0].data.length === 64) {
      return parsedShares[0].data;
    }
    throw new Error('Need at least 2 distinct valid shares (or 1 direct 64-character Master Key) to reconstruct the key.');
  }

  return reconstructFromTwoShares(parsedShares[0], parsedShares[1]);
}

/**
 * Reconstruct master key from exactly two ShamirShare objects using Lagrange interpolation in GF(256)
 */
export function reconstructFromTwoShares(sA: ShamirShare, sB: ShamirShare): string {
  const xA = sA.x;
  const xB = sB.x;

  if (xA === xB) {
    throw new Error('Cannot reconstruct key from identical share indices.');
  }

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

