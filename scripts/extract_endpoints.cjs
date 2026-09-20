const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const zips = [
  'ezgif-72c1a8e7ca89c13e-jpg.zip',
  'ezgif-74b196dc4f4a758b-jpg.zip',
  'ezgif-7326dbc9aeba0e2e-jpg.zip',
  'ezgif-7e2e52eb054723e8-jpg.zip',
  'ezgif-7139b16931cf41e6-jpg.zip',
  'ezgif-73cfdd206df7b6d2-jpg.zip',
  'ezgif-7f611ff710190ca1-jpg.zip'
];

const tempDir = path.join(process.env.TEMP, 'frame-check');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

for (let i = 0; i < zips.length; i++) {
  const zip = zips[i];
  const zipOutDir = path.join(tempDir, `zip${i}`);
  if (!fs.existsSync(zipOutDir)) fs.mkdirSync(zipOutDir, { recursive: true });
  
  const lastFile = (i === 6) ? 'ezgif-frame-160.jpg' : 'ezgif-frame-300.jpg';
  try {
    execSync(`tar -xf "${zip}" -C "${zipOutDir}" ezgif-frame-001.jpg ${lastFile}`);
    console.log(`Extracted zip${i} (${zip}) endpoints`);
  } catch (e) {
    console.error(`Error on ${zip}:`, e.message);
  }
}
