/**
 * fix_images.js
 * Bulk updates categories and products to use correct image paths.
 * Run: node scripts/fix_images.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGODB_URI;

const imageMap = {
    'Ssk Panel Light': 'page_3.jpeg',
    'Moon Surface Light': 'page_4.jpeg',
    'Ecco Deep Down Light': 'page_5.jpeg',
    'Regular Deep Down Light': 'page_6.jpeg',
    'Ultra Deep Down Light': 'page_7.jpeg',
    'Mini Junction Light': 'page_8.jpeg',
    'Big Junction Light': 'page_8.jpeg',
    'COB Junction Light': 'page_9.jpeg',
    'Rembow Junction Light': 'page_10.png',
    'Bulb Light': 'page_11.jpeg',
    'Tube Light': 'page_12.jpeg',
    'Batan Spot Light': 'page_14.jpeg',
    'PC Sticker Indoor SMD Surface Light': 'page_15.jpeg',
    'Metal Spot Light': 'page_17.jpeg',
    'Curve Spot Light': 'page_18.jpeg',
    'Ring Cylinder Light': 'page_19.jpeg',
    'Creta COB Light': 'page_20.jpeg',
    'Delta COB Light': 'page_21.jpeg',
    'Creta COB Cylinder Light': 'page_22.jpeg',
    'Profile Strip Light': 'page_29.jpeg',
    'Profile Light': 'page_30.jpeg',
    'Oval Bulkhead Light': 'page_13.jpeg',
    'Water Proof Sticker Outdoor COB Surface Light': 'page_16.jpeg',
    'Lens Street Light': 'page_23.jpeg',
    'X Series Flood Light': 'page_25.png',
    'Back Chock Flood Light': 'page_26.jpeg',
    'Wired Rope Light': 'page_28.jpeg',
    'High Bay Flood Light': 'page_27.jpeg',
    'Street Light Clamp': 'page_24.png',
    'SMPS Strip Driver': 'page_31.jpeg'
};

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Update Categories
        const categories = await Category.find({});
        console.log(`Checking ${categories.length} categories...`);

        for (const cat of categories) {
            const fileName = imageMap[cat.name];
            if (fileName) {
                const newPath = `/assets/products/${fileName}`;
                if (cat.bannerImage !== newPath) {
                    cat.bannerImage = newPath;
                    await cat.save();
                    console.log(`✓ Updated Category: ${cat.name} -> ${newPath}`);
                }
            } else {
                console.log(`? No mapping for Category: ${cat.name}`);
            }
        }

        // 2. Update Products
        const products = await Product.find({}).populate('category');
        console.log(`\nChecking ${products.length} products...`);

        for (const prod of products) {
            let fileName = null;
            
            // Try matching by product name first
            fileName = imageMap[prod.name];
            
            // If no direct match, try matching by category name
            if (!fileName && prod.category) {
                fileName = imageMap[prod.category.name];
            }

            if (fileName) {
                const newPath = `/assets/products/${fileName}`;
                if (prod.image !== newPath) {
                    prod.image = newPath;
                    // Also update images array if it exists
                    if (prod.images && prod.images.length === 0) {
                        prod.images = [newPath];
                    }
                    await prod.save();
                    console.log(`✓ Updated Product: ${prod.name} -> ${newPath}`);
                }
            } else {
                console.log(`? No mapping for Product: ${prod.name}`);
            }
        }

        console.log('\nFix completed successfully.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
