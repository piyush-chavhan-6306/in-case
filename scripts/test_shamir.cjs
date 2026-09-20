// Test pure GF(256) Shamir (2-of-3)
const exp = new Uint8Array(512);
const log = new Uint8Array(256);
let x = 1;
for (let i = 0; i < 255; i++) {
  exp[i] = x;
  exp[i + 255] = x;
  log[x] = i;
  x = x ^ (x << 1);
  if (x & 0x100) x ^= 0x11b;
}

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return exp[log[a] + log[b]];
}

function gfDiv(a, b) {
  if (b === 0) throw new Error("Division by zero");
  if (a === 0) return 0;
  return exp[(log[a] - log[b] + 255) % 255];
}

function splitSecret(hexKey) {
  const secretBytes = Buffer.from(hexKey, 'hex');
  const len = secretBytes.length;
  const share1 = new Uint8Array(len);
  const share2 = new Uint8Array(len);
  const share3 = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    const s = secretBytes[i];
    const a1 = (Math.floor(Math.random() * 255) + 1); // random non-zero
    share1[i] = s ^ gfMul(a1, 1);
    share2[i] = s ^ gfMul(a1, 2);
    share3[i] = s ^ gfMul(a1, 3);
  }

  return [
    { x: 1, data: Buffer.from(share1).toString('hex') },
    { x: 2, data: Buffer.from(share2).toString('hex') },
    { x: 3, data: Buffer.from(share3).toString('hex') },
  ];
}

function recoverSecret(shareA, shareB) {
  const xA = shareA.x;
  const xB = shareB.x;
  const bytesA = Buffer.from(shareA.data, 'hex');
  const bytesB = Buffer.from(shareB.data, 'hex');
  const len = bytesA.length;
  const recovered = new Uint8Array(len);

  const denom = xA ^ xB;
  const lA = gfDiv(xB, denom);
  const lB = gfDiv(xA, denom);

  for (let i = 0; i < len; i++) {
    const termA = gfMul(bytesA[i], lA);
    const termB = gfMul(bytesB[i], lB);
    recovered[i] = termA ^ termB;
  }

  return Buffer.from(recovered).toString('hex');
}

// Test with 256-bit AES key
const originalKey = "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00";
const shares = splitSecret(originalKey);
console.log("Original Key:", originalKey);
console.log("Shares generated:", shares);

const rec12 = recoverSecret(shares[0], shares[1]);
console.log("Recovered from 1 & 2:", rec12, rec12 === originalKey ? "MATCH!" : "FAIL");

const rec13 = recoverSecret(shares[0], shares[2]);
console.log("Recovered from 1 & 3:", rec13, rec13 === originalKey ? "MATCH!" : "FAIL");

const rec23 = recoverSecret(shares[1], shares[2]);
console.log("Recovered from 2 & 3:", rec23, rec23 === originalKey ? "MATCH!" : "FAIL");
