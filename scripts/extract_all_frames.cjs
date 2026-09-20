const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const orderedZips = [
  'ezgif-72c1a8e7ca89c13e-jpg.zip', // 1: 300 frames (1 - 300)
  'ezgif-74b196dc4f4a758b-jpg.zip', // 2: 300 frames (301 - 600)
  'ezgif-7326dbc9aeba0e2e-jpg.zip', // 3: 300 frames (601 - 900)
  'ezgif-7e2e52eb054723e8-jpg.zip', // 4: 300 frames (901 - 1200)
  'ezgif-7139b16931cf41e6-jpg.zip', // 5: 300 frames (1201 - 1500)
  'ezgif-73cfdd206df7b6d2-jpg.zip', // 6: 300 frames (1501 - 1800)
  'ezgif-7f611ff710190ca1-jpg.zip'  // 7: 160 frames (1801 - 1960)
];

const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'public', 'frames');
const tempExtractDir = path.join(process.env.TEMP, 'incase-unpack');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(tempExtractDir)) {
  fs.mkdirSync(tempExtractDir, { recursive: true });
}

let globalIndex = 1;

for (let z = 0; z < orderedZips.length; z++) {
  const zipName = orderedZips[z];
  const zipPath = path.join(projectRoot, zipName);
  console.log(`\n[${z + 1}/${orderedZips.length}] Processing ${zipName}...`);

  const zipTemp = path.join(tempExtractDir, `chunk_${z}`);
  if (!fs.existsSync(zipTemp)) {
    fs.mkdirSync(zipTemp, { recursive: true });
  }

  // Extract all files in zip
  console.log(`Extracting ${zipName} to temp directory...`);
  execSync(`tar -xf "${zipPath}" -C "${zipTemp}"`);

  // Read files and sort by frame number
  const files = fs.readdirSync(zipTemp).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  files.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  console.log(`Found ${files.length} frames in ${zipName}. Moving and renaming to destination...`);
  for (const file of files) {
    const src = path.join(zipTemp, file);
    const paddedIndex = String(globalIndex).padStart(4, '0');
    const dest = path.join(outDir, `frame-${paddedIndex}.jpg`);
    fs.copyFileSync(src, dest);
    globalIndex++;
  }
}

console.log(`\nSuccessfully processed and indexed ${globalIndex - 1} total frames into ${outDir}!`);
