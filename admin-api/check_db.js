const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Product = require('./models/Product');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Category.find({}, 'name slug bannerImage');
        console.log('CATEGORIES:');
        categories.forEach(c => console.log(`- ${c.name} (${c.slug}) | Image: ${c.bannerImage || 'NONE'}`));
        
        const products = await Product.find({}, 'name slug image').limit(5);
        console.log('\nPRODUCTS (first 5):');
        products.forEach(p => console.log(`- ${p.name} (${p.slug}) | Image: ${p.image || 'NONE'}`));
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
