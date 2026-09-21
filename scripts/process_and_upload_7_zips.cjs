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
const tempDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'incase_7zips');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const zips = [
  { file: '1.zip', count: 300, start: 1 },
  { file: '2.zip', count: 300, start: 301 },
  { file: '3.zip', count: 300, start: 601 },
  { file: '4.zip', count: 300, start: 901 },
  { file: '5.zip', count: 300, start: 1201 },
  { file: '6.zip', count: 300, start: 1501 },
  { file: '7.zip', count: 27,  start: 1801 }
];

const TOTAL_FRAMES = 1827;
const CONCURRENCY = 8;

async function processAll() {
  console.log(`\n=== Processing & Uploading All 7 Zips (${TOTAL_FRAMES} Total Frames) ===`);

  // Step 1: Unpack and convert each zip to WebP
  for (const item of zips) {
    const zipPath = path.join(projectRoot, item.file);
    console.log(`\n[Unpacking ${item.file}] frames ${item.start} to ${item.start + item.count - 1}...`);
    
    const chunkDir = path.join(tempDir, `chunk_${item.file.replace('.zip', '')}`);
    if (fs.existsSync(chunkDir)) {
      fs.rmSync(chunkDir, { recursive: true, force: true });
    }
    fs.mkdirSync(chunkDir, { recursive: true });

    execSync(`tar -xf "${zipPath}" -C "${chunkDir}"`);
    const files = fs.readdirSync(chunkDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    files.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });

    console.log(`Found ${files.length} frames. Converting to WebP and saving locally...`);
    for (let i = 0; i < files.length; i++) {
      const frameNum = item.start + i;
      const pad = String(frameNum).padStart(4, '0');
      const srcFile = path.join(chunkDir, files[i]);
      const destWebp = path.join(outDir, `frame-${pad}.webp`);

      // Convert to 1080p WebP
      await sharp(srcFile)
        .resize(1920, 1080)
        .webp({ quality: 80, effort: 4 })
        .toFile(destWebp);
    }

    fs.rmSync(chunkDir, { recursive: true, force: true });
    console.log(`Chunk ${item.file} converted successfully!`);
  }

  console.log(`\nAll ${TOTAL_FRAMES} frames converted to WebP in public/frames!`);

  // Step 2: Upload all frames to Supabase Storage with concurrency
  console.log(`\nUploading all ${TOTAL_FRAMES} frames to Supabase Storage bucket 'frames'...`);

  let completed = 0;
  let active = 0;
  let currentIndex = 1;

  async function uploadFrame(frameNum, retries = 3) {
    const pad = String(frameNum).padStart(4, '0');
    const filename = `frame-${pad}.webp`;
    const filePath = path.join(outDir, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`Missing file: ${filename}`);
      return false;
    }

    const buffer = fs.readFileSync(filePath);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error } = await supabase.storage
          .from('frames')
          .upload(filename, buffer, {
            contentType: 'image/webp',
            upsert: true,
            cacheControl: '31536000'
          });

        if (error) throw error;
        return true;
      } catch (err) {
        if (attempt === retries) {
          console.error(`[FAIL] ${filename}: ${err.message}`);
          return false;
        }
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
    return false;
  }

  return new Promise((resolve) => {
    function next() {
      if (currentIndex > TOTAL_FRAMES && active === 0) {
        console.log(`\n=== All ${TOTAL_FRAMES} frames uploaded to Supabase Storage CDN! ===`);
        resolve();
        return;
      }

      while (active < CONCURRENCY && currentIndex <= TOTAL_FRAMES) {
        const frameIdx = currentIndex++;
        active++;

        uploadFrame(frameIdx).then(() => {
          active--;
          completed++;
          if (completed % 50 === 0 || completed === TOTAL_FRAMES) {
            const pad = String(frameIdx).padStart(4, '0');
            console.log(`[${completed}/${TOTAL_FRAMES}] Uploaded frame-${pad}.webp (${((completed/TOTAL_FRAMES)*100).toFixed(1)}%)`);
          }
          next();
        });
      }
    }

    next();
  });
}

processAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
