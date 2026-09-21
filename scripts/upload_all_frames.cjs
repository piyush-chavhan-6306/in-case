const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zvrozvsmggujrodnxstj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cm96dnNtZ2d1anJvZG54c3RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkwNTExNCwiZXhwIjoyMTA1NDgxMTE0fQ.SfpHJ3fhSjw9LgKZ9ocUVj68I1Ly7bqaWufvcj4gZGw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const FRAMES_DIR = path.join(__dirname, '..', 'public', 'frames');
const TOTAL_FRAMES = 1827; // Full 1,827 frames across all 7 zips
const CONCURRENCY = 8;

async function getExistingRemoteFiles() {
  console.log('Fetching list of already uploaded files in Supabase Storage...');
  const remoteFiles = new Set();
  let offset = 0;
  const limit = 500;

  while (true) {
    const { data, error } = await supabase.storage
      .from('frames')
      .list('', { limit, offset, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      console.warn('Could not list remote files, will upload with upsert:', error.message);
      break;
    }

    if (!data || data.length === 0) break;

    for (const file of data) {
      remoteFiles.add(file.name);
    }

    if (data.length < limit) break;
    offset += limit;
  }

  console.log(`Found ${remoteFiles.size} existing files in 'frames' bucket.`);
  return remoteFiles;
}

async function uploadFrameWithRetry(frameIndex, retries = 3) {
  const pad = String(frameIndex + 1).padStart(4, '0');
  const inputName = `frame-${pad}.png`;
  const outputName = `frame-${pad}.webp`;
  const inputPath = path.join(FRAMES_DIR, inputName);

  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Missing local file: ${inputName}`);
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const buffer = await sharp(inputPath)
        .resize(1920, 1080)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const { error } = await supabase.storage
        .from('frames')
        .upload(outputName, buffer, {
          contentType: 'image/webp',
          upsert: true,
          cacheControl: '31536000'
        });

      if (error) throw error;
      return true;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[FAIL] ${outputName} after ${retries} attempts:`, err.message);
        return false;
      }
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return false;
}

async function main() {
  console.log(`Starting Supabase Frame Upload (Total: ${TOTAL_FRAMES}, Concurrency: ${CONCURRENCY})...`);
  const existingFiles = await getExistingRemoteFiles();

  const tasks = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const pad = String(i + 1).padStart(4, '0');
    const outputName = `frame-${pad}.webp`;
    if (!existingFiles.has(outputName)) {
      tasks.push(i);
    }
  }

  console.log(`Tasks to process: ${tasks.length} / ${TOTAL_FRAMES}`);

  let completed = TOTAL_FRAMES - tasks.length;
  let active = 0;
  let currentIndex = 0;

  return new Promise((resolve) => {
    if (tasks.length === 0) {
      console.log('All frames already uploaded!');
      resolve();
      return;
    }

    function next() {
      if (currentIndex >= tasks.length && active === 0) {
        console.log(`\nAll ${TOTAL_FRAMES} frames processed successfully!`);
        resolve();
        return;
      }

      while (active < CONCURRENCY && currentIndex < tasks.length) {
        const frameIdx = tasks[currentIndex++];
        active++;

        uploadFrameWithRetry(frameIdx).then((success) => {
          active--;
          completed++;
          if (completed % 25 === 0 || completed === TOTAL_FRAMES) {
            const pad = String(frameIdx + 1).padStart(4, '0');
            console.log(`[${completed}/${TOTAL_FRAMES}] Uploaded frame-${pad}.webp (${((completed/TOTAL_FRAMES)*100).toFixed(1)}%)`);
          }
          next();
        });
      }
    }

    next();
  });
}

main().catch(console.error);
