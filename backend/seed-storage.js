/* eslint-disable no-undef */
// backend/seed-storage.js
// Usage: node seed-storage.js <bucket-name>
// Ensure .env has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// Also npm install @supabase/supabase-js dotenv

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// Get bucket name from command line args or environment variable, default to 'avatars'
const bucketName = process.argv[2] || process.env.BUCKET_NAME_AVATARS || 'avatars'; 
const seedDir = path.join(__dirname, 'supabase', 'storage-seed');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.');
  console.log('Ensure you have a .env file with these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStorage() {
  console.log(`Starting storage seed for bucket: '${bucketName}'...`);
  
  // check if bucket exists, create if not
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const bucketExists = buckets.find(b => b.name === bucketName);
  if (!bucketExists) {
    console.log(`Bucket '${bucketName}' does not exist. Creating...`);
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true // Assuming public bucket for images
    });
    if (createError) {
        console.error(`Error creating bucket '${bucketName}':`, createError.message);
        return;
    }
    console.log(`Bucket '${bucketName}' created.`);
  } else {
      console.log(`Bucket '${bucketName}' found.`);
  }

  if (!fs.existsSync(seedDir)) {
      console.error(`Seed directory not found: ${seedDir}`);
      return;
  }

  const files = fs.readdirSync(seedDir);
  
  for (const file of files) {
    // skip hidden files/directories
    if (file.startsWith('.')) continue;

    const filePath = path.join(seedDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath);
        const contentType = getContentType(file);
        
        console.log(`Uploading ${file}...`);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(file, fileContent, {
                upsert: true,
                contentType: contentType
            });

        if (error) {
            console.error(`Failed to upload ${file}:`, error.message);
        } else {
            console.log(`Successfully uploaded ${file}`);
        }
    }
  }
  console.log('Storage seeding completed.');
}

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const map = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf'
    };
    return map[ext] || 'application/octet-stream';
}

seedStorage().catch(err => console.error(err));
