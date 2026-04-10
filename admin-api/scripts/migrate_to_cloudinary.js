const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  try {
    console.log('--- Starting Production Image Migration ---');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Production MongoDB');

    // Local Search Paths
    const searchPaths = [
      path.join(__dirname, '../uploads/categories'),
      path.join(__dirname, '../uploads'),
      path.join(__dirname, '../../lichtor-web/public/assets/products'),
      path.join(__dirname, '../../lichtor-web/public/assets')
    ];

    // 1. Migrate Categories
    console.log('\n--- Migrating Categories ---');
    const categories = await Category.find({});
    console.log(`Checking ${categories.length} categories...`);

    for (const cat of categories) {
      if (!cat.bannerImage || cat.bannerImage.startsWith('http')) continue;

      // Extract filename
      const filename = path.basename(cat.bannerImage);
      let localPath = null;

      // Search for file in known locations
      for (const sp of searchPaths) {
        const p = path.join(sp, filename);
        if (fs.existsSync(p)) {
          localPath = p;
          break;
        }
      }

      if (localPath) {
        console.log(`Uploading ${cat.name} image: ${localPath}...`);
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'lichtor-web/categories',
            use_filename: true,
            unique_filename: false
          });
          
          cat.bannerImage = result.secure_url;
          await cat.save();
          console.log(`✅ Fixed Category: ${cat.name} -> ${result.secure_url}`);
        } catch (uploadErr) {
          console.error(`❌ Upload failed for ${cat.name}:`, uploadErr.message);
        }
      } else {
        console.warn(`⚠️ Local image not found for ${cat.name}: ${cat.bannerImage}`);
      }
    }

    // 2. Migrate Products
    console.log('\n--- Migrating Products ---');
    const products = await Product.find({});
    console.log(`Checking ${products.length} products...`);

    for (const prod of products) {
      const images = prod.images || [];
      if (images.length === 0 || images.some(img => !img.startsWith('http'))) {
        
        // Search by slug fallback if images array is empty
        const searchName = prod.slug;
        let localPath = null;

        for (const sp of searchPaths) {
          const files = fs.existsSync(sp) ? fs.readdirSync(sp) : [];
          const match = files.find(f => f.includes(searchName));
          if (match) {
            localPath = path.join(sp, match);
            break;
          }
        }
        
        if (localPath) {
          console.log(`Matching image found for ${prod.name}: ${localPath}`);
          try {
            const result = await cloudinary.uploader.upload(localPath, {
              folder: 'lichtor-web/products',
              use_filename: true,
              unique_filename: true
            });
            
            prod.images = [result.secure_url];
            await prod.save();
            console.log(`✅ Fixed Product: ${prod.name} -> ${result.secure_url}`);
          } catch (uploadErr) {
            console.error(`❌ Upload failed for ${prod.name}:`, uploadErr.message);
          }
        }
      }
    }

    console.log('\n--- Migration Complete! ---');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
