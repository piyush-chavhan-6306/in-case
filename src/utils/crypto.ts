import { splitKey, combineShares } from './shamir';
import QRCode from 'qrcode';
import { VaultData, TrustedShare, InventoryItem } from '../types';

// Convert ArrayBuffer to Hex String
function buf2hex(buffer: ArrayBuffer): string {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

// Convert Hex String to Uint8Array
function hex2buf(hexString: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Generate a random 256-bit AES key for WebCrypto
 */
export async function generateMasterKey(): Promise<{ key: CryptoKey; keyHex: string }> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await window.crypto.subtle.exportKey('raw', key);
  const keyHex = buf2hex(exported);
  return { key, keyHex };
}

/**
 * Import a hex string as a CryptoKey
 */
export async function importMasterKey(keyHex: string): Promise<CryptoKey> {
  const raw = hex2buf(keyHex);
  return await window.crypto.subtle.importKey(
    'raw',
    raw as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
}

/**
 * Encrypt the entire family inventory using AES-256-GCM
 */
export async function encryptInventory(
  items: InventoryItem[],
  key: CryptoKey
): Promise<VaultData> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit standard IV for AES-GCM
  const encodedData = new TextEncoder().encode(JSON.stringify(items));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    encodedData
  );

  return {
    ciphertext: buf2hex(ciphertextBuffer),
    iv: buf2hex(iv.buffer),
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    itemCount: items.length,
  };
}

/**
 * Decrypt the vault ciphertext using reconstructed master key
 */
export async function decryptInventory(
  vault: VaultData,
  key: CryptoKey
): Promise<InventoryItem[]> {
  const iv = hex2buf(vault.iv);
  const ciphertext = hex2buf(vault.ciphertext);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    ciphertext as unknown as BufferSource
  );

  const decodedJson = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decodedJson) as InventoryItem[];
}

/**
 * Split 256-bit master key hex into 3 Shamir shares with threshold = 2
 */
export async function splitKeyIntoTrustedShares(
  keyHex: string,
  personNames: [string, string, string] = ['Spouse / Partner', 'Parent / Sibling', 'Trusted Family Friend']
): Promise<TrustedShare[]> {
  // Pure browser-native GF(256) Shamir Secret Sharing
  const shares = splitKey(keyHex, 3, 2);

  const trustedShares: TrustedShare[] = [];
  const labels = ['Trusted Person A', 'Trusted Person B', 'Trusted Person C'];

  for (let i = 0; i < 3; i++) {
    const shareData = shares[i];
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(shareData, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 240,
        color: {
          dark: '#0b132b',
          light: '#fdfbf7',
        },
      });
    } catch (e) {
      console.error('Failed to generate QR code for share', e);
    }

    trustedShares.push({
      id: `share-${i + 1}`,
      shareIndex: i + 1,
      label: labels[i],
      recipientName: personNames[i],
      shareData,
      qrDataUrl,
      createdAt: new Date().toISOString(),
    });
  }

  return trustedShares;
}

/**
 * Combine any 2 shares to recover the master key hex, or return the master key if directly entered
 */
export function combineSharesToKeyHex(shares: string[]): string {
  try {
    // 1. Sanitize inputs: strip whitespace, quotes, and 0x prefix
    const cleaned = shares
      .map((s) => (s || '').trim().replace(/^['"]|['"]$/g, '').replace(/^0x/i, ''))
      .filter((s) => s.length > 0);

    // 2. Direct 64-character master key check
    for (const keyCandidate of cleaned) {
      if (/^[0-9a-fA-F]{64}$/i.test(keyCandidate) && !keyCandidate.toUpperCase().startsWith('INCASE-SHARE')) {
        // If there is only 1 input or explicitly this master key, return directly
        if (cleaned.length === 1) {
          return keyCandidate.toLowerCase();
        }
      }
    }

    // 3. Combine shares using Shamir
    const combinedHex = combineShares(cleaned);
    if (!combinedHex || combinedHex.length < 32) {
      throw new Error('Recombined key is invalid.');
    }
    return combinedHex.toLowerCase();
  } catch (err: any) {
    throw new Error('Invalid or incompatible shares provided: ' + (err?.message || 'Check share codes.'));
  }
}

