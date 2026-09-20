const fs = require('fs');
const path = require('path');

const zips = [
  'ezgif-72c1a8e7ca89c13e-jpg.zip', // 0
  'ezgif-74b196dc4f4a758b-jpg.zip', // 1
  'ezgif-7326dbc9aeba0e2e-jpg.zip', // 2
  'ezgif-7e2e52eb054723e8-jpg.zip', // 3
  'ezgif-7139b16931cf41e6-jpg.zip', // 4
  'ezgif-73cfdd206df7b6d2-jpg.zip', // 5
  'ezgif-7f611ff710190ca1-jpg.zip'  // 6 (160 frames)
];

const tempDir = path.join(process.env.TEMP, 'frame-check');

function getFileBuf(p) {
  return fs.readFileSync(p);
}

for (let i = 0; i < zips.length; i++) {
  const lastFrameFile = i === 6 ? 'ezgif-frame-160.jpg' : 'ezgif-frame-300.jpg';
  const lastPath = path.join(tempDir, `zip${i}`, lastFrameFile);
  const lastBuf = getFileBuf(lastPath);

  console.log(`\n--- Best matches for end of zip${i} (${zips[i]}):`);
  let bestJ = -1;
  let minDiff = Infinity;

  for (let j = 0; j < zips.length; j++) {
    if (i === j) continue;
    const firstPath = path.join(tempDir, `zip${j}`, 'ezgif-frame-001.jpg');
    const firstBuf = getFileBuf(firstPath);

    // Compute byte differences over first 20000 bytes
    const len = Math.min(lastBuf.length, firstBuf.length, 30000);
    let diff = 0;
    for (let k = 1000; k < len; k += 4) {
      diff += Math.abs(lastBuf[k] - firstBuf[k]);
    }

    console.log(`  -> start of zip${j} (${zips[j]}): diff metric = ${diff}`);
    if (diff < minDiff) {
      minDiff = diff;
      bestJ = j;
    }
  }
  console.log(`  ==> BEST MATCH: zip${bestJ} (${zips[bestJ]}) with metric ${minDiff}`);
}
