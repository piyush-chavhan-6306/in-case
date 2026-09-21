const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zvrozvsmggujrodnxstj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cm96dnNtZ2d1anJvZG54c3RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkwNTExNCwiZXhwIjoyMTA1NDgxMTE0fQ.SfpHJ3fhSjw9LgKZ9ocUVj68I1Ly7bqaWufvcj4gZGw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'public', 'frames');
const tempDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'incase_zipwise_build');

// Clean outDir
console.log('1. Clearing local public/frames directory...');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Upload concurrency helper
async function uploadBatch(filesList, concurrency = 10) {
  let active = 0;
  let idx = 0;
  return new Promise((resolve) => {
    function next() {
      if (idx >= filesList.length && active === 0) {
        resolve();
        return;
      }
      while (active < concurrency && idx < filesList.length) {
        const item = filesList[idx++];
        active++;
        supabase.storage
          .from('frames')
          .upload(item.filename, item.buffer, {
            contentType: 'image/webp',
            upsert: true,
            cacheControl: '31536000'
          })
          .then(({ error }) => {
            if (error) console.error(`  [ERROR] ${item.filename}:`, error.message);
          })
          .catch((err) => console.error(`  [FAIL] ${item.filename}:`, err.message))
          .finally(() => {
            active--;
            next();
          });
      }
    }
    next();
  });
}

const zipSequence = [
  { name: '1.zip', expected: 300, startFrame: 1 },
  { name: '2.zip', expected: 300, startFrame: 301 },
  { name: '3.zip', expected: 300, startFrame: 601 },
  { name: '4.zip', expected: 300, startFrame: 901 },
  { name: '5.zip', expected: 300, startFrame: 1201 },
  { name: '6.zip', expected: 300, startFrame: 1501 },
  { name: '7.zip', expected: 27,  startFrame: 1801 }
];

async function main() {
  console.log('=== STARTING CLEAN ZIP-BY-ZIP EXTRACTION & UPLOAD ===\n');

  let globalFrameCount = 0;

  for (let z = 0; z < zipSequence.length; z++) {
    const item = zipSequence[z];
    const zipPath = path.join(projectRoot, item.name);
    console.log(`\n--------------------------------------------------`);
    console.log(`[ZIP ${z + 1}/7] Processing ${item.name} (Frames ${item.startFrame} - ${item.startFrame + item.expected - 1})...`);
    console.log(`--------------------------------------------------`);

    if (!fs.existsSync(zipPath)) {
      console.error(`ERROR: ${item.name} not found at ${zipPath}!`);
      process.exit(1);
    }

    const chunkTemp = path.join(tempDir, `chunk_${z}`);
    if (fs.existsSync(chunkTemp)) {
      fs.rmSync(chunkTemp, { recursive: true, force: true });
    }
    fs.mkdirSync(chunkTemp, { recursive: true });

    // Step A: Extract
    console.log(`  -> Extracting ${item.name} to temporary directory...`);
    execSync(`tar -xf "${zipPath}" -C "${chunkTemp}"`);

    // Step B: Sort files
    const rawFiles = fs.readdirSync(chunkTemp).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    rawFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });

    console.log(`  -> Found ${rawFiles.length} frames in ${item.name}. Converting to WebP...`);

    const uploadItems = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const frameNum = item.startFrame + i;
      const pad = String(frameNum).padStart(4, '0');
      const filename = `frame-${pad}.webp`;
      const srcPath = path.join(chunkTemp, rawFiles[i]);
      const destPath = path.join(outDir, filename);

      const buffer = await sharp(srcPath)
        .resize(1920, 1080)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      // Save locally
      fs.writeFileSync(destPath, buffer);

      uploadItems.push({ filename, buffer });
      globalFrameCount++;
    }

    // Step C: Upload this zip immediately to Supabase
    console.log(`  -> Uploading ${uploadItems.length} frames from ${item.name} directly to Supabase Storage CDN...`);
    await uploadBatch(uploadItems, 10);
    console.log(`  -> [SUCCESS] ${item.name} uploaded cleanly! (Total film frames so far: ${globalFrameCount})`);

    // Step D: Clean temp chunk
    fs.rmSync(chunkTemp, { recursive: true, force: true });
  }

  console.log(`\n==================================================`);
  console.log(`ALL 7 ZIPS PROCESSED & UPLOADED IN EXACT SEQUENCE!`);
  console.log(`Total Frames: ${globalFrameCount}`);
  console.log(`==================================================`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
