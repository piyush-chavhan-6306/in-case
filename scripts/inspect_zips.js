const { execSync } = require('child_process');
const fs = require('fs');

const zips = [
  'ezgif-72c1a8e7ca89c13e-jpg.zip',
  'ezgif-74b196dc4f4a758b-jpg.zip',
  'ezgif-7326dbc9aeba0e2e-jpg.zip',
  'ezgif-7f611ff710190ca1-jpg.zip',
  'ezgif-7139b16931cf41e6-jpg.zip',
  'ezgif-73cfdd206df7b6d2-jpg.zip'
];

for (const zip of zips) {
  try {
    const output = execSync(`tar -tf "${zip}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const lines = output.trim().split(/\r?\n/).filter(Boolean);
    console.log(`${zip}: count=${lines.length}, first=${lines[0]}, last=${lines[lines.length - 1]}`);
  } catch (err) {
    console.error(`Error with ${zip}:`, err.message);
  }
}
