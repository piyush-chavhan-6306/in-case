/**
 * Client-Side Browser Native Document Compression & Decompression Utilities
 * Uses gzip algorithm with GZIP streams or fallback
 */

export interface CompressedDocPayload {
  name: string;
  type: string;
  originalSize: number;
  compressedSize: number;
  dataBase64: string;
  isCompressed: boolean;
  uploadedAt: string;
}

// Convert Uint8Array to Base64
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compresses a user-selected File or Blob using browser GZIP CompressionStream
 */
export async function compressDocument(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<CompressedDocPayload> {
  onProgress?.(10, 'Reading file buffer...');
  const arrayBuffer = await file.arrayBuffer();
  const originalSize = arrayBuffer.byteLength;

  onProgress?.(35, 'Compressing document with GZIP stream...');

  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Response(arrayBuffer).body?.pipeThrough(new CompressionStream('gzip'));
      if (stream) {
        const compressedArrayBuffer = await new Response(stream).arrayBuffer();
        const compressedBytes = new Uint8Array(compressedArrayBuffer);
        const compressedSize = compressedBytes.byteLength;

        onProgress?.(75, 'Packaging compressed payload...');
        const base64 = uint8ArrayToBase64(compressedBytes);

        onProgress?.(100, 'Document successfully compressed!');
        return {
          name: file.name,
          type: file.type || 'application/octet-stream',
          originalSize,
          compressedSize,
          dataBase64: base64,
          isCompressed: true,
          uploadedAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('CompressionStream failed, fallback to raw', e);
    }
  }

  // Fallback if CompressionStream fails
  onProgress?.(100, 'Packaging payload...');
  const rawBytes = new Uint8Array(arrayBuffer);
  return {
    name: file.name,
    type: file.type || 'application/octet-stream',
    originalSize,
    compressedSize: originalSize,
    dataBase64: uint8ArrayToBase64(rawBytes),
    isCompressed: false,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Decompresses a stored compressed document back to an object URL for preview/download
 */
export async function decompressDocument(
  payload: CompressedDocPayload,
  onProgress?: (percent: number, status: string) => void
): Promise<{ blobUrl: string; mimeType: string }> {
  onProgress?.(20, 'Unpacking compressed payload...');
  const bytes = base64ToUint8Array(payload.dataBase64);

  if (!payload.isCompressed || typeof DecompressionStream === 'undefined') {
    onProgress?.(100, 'Document ready!');
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: payload.type });
    return { blobUrl: URL.createObjectURL(blob), mimeType: payload.type };
  }

  onProgress?.(50, 'Decompressing GZIP stream...');
  const stream = new Response(bytes.buffer as ArrayBuffer).body?.pipeThrough(new DecompressionStream('gzip'));
  if (!stream) {
    throw new Error('Decompression stream could not be created');
  }

  const decompressedBuffer = await new Response(stream).arrayBuffer();
  onProgress?.(90, 'Restoring original document format...');

  const blob = new Blob([decompressedBuffer], { type: payload.type });
  const blobUrl = URL.createObjectURL(blob);

  onProgress?.(100, 'Decompression complete!');
  return { blobUrl, mimeType: payload.type };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
