const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const Category = require('./models/Category');

require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lichtor_admin';

// Re-structured parsed data from the PDF extract
const catalogueData = [
    {
        category: 'LED Panel Light',
        products: [
            { name: 'Ssk PANEL LIGHT Round 8W', watt: '8W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] },
            { name: 'Ssk PANEL LIGHT Square 8W', watt: '8W', shape: 'Square', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] },
            { name: 'Ssk PANEL LIGHT Round 15W', watt: '15W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] },
            { name: 'Ssk PANEL LIGHT Square 15W', watt: '15W', shape: 'Square', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] },
            { name: 'Ssk PANEL LIGHT Round 22W', watt: '22W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] },
            { name: 'Ssk PANEL LIGHT Square 22W', watt: '22W', shape: 'Square', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker', 'Surge protection', 'High power factor'] }
        ]
    },
    {
        category: 'LED Surface Light',
        products: [
            { name: 'Moon SURFACE LIGHT 8W', watt: '8W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-Built Driver', 'Superior Surge Protection', 'Wall/Ceiling mountable', 'High grade diffuser'] },
            { name: 'Moon SURFACE LIGHT 15W', watt: '15W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-Built Driver', 'Superior Surge Protection', 'Wall/Ceiling mountable', 'High grade diffuser'] },
            { name: 'Moon SURFACE LIGHT 22W', watt: '22W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-Built Driver', 'Superior Surge Protection', 'Wall/Ceiling mountable', 'High grade diffuser'] },
            { name: 'DRIVERLESS SURFACE LIGHT Indoor 3W', watt: '3W', shape: 'Round', cct: 'CW, NW, WW, C+W+N, PINK', features: ['In-Built Driver', 'Superior Surge Protection', 'Wall/Ceiling mountable', 'High grade diffuser'] },
            { name: 'DRIVERLESS SURFACE LIGHT Outdoor 3W', watt: '3W', shape: 'Round', cct: 'BLACK, WW', features: ['In-Built Driver', 'Superior Surge Protection', 'Wall/Ceiling mountable', 'High grade diffuser'] }
        ]
    },
    {
        category: 'LED Down Light',
        products: [
            { name: 'Ecco DEEP DOWN LIGHT 8W', watt: '8W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection'] },
            { name: 'Ecco DEEP DOWN LIGHT 15W', watt: '15W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection'] },
            { name: 'Ecco DEEP DOWN LIGHT 22W', watt: '22W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker LED light', 'In-built surge protection'] },
            { name: 'Regular DEEP DOWN LIGHT 12W', watt: '12W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Recessed LED down light', 'Die Cast aluminium body', 'High grade, anti-glare diffuser', 'High lumen'] },
            { name: 'Regular DEEP DOWN LIGHT 18W', watt: '18W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Recessed LED down light', 'Die Cast aluminium body', 'High grade, anti-glare diffuser', 'High lumen'] },
            { name: 'Regular DEEP DOWN LIGHT 22W', watt: '22W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Recessed LED down light', 'Die Cast aluminium body', 'High grade, anti-glare diffuser', 'High lumen'] },
            { name: 'Ultra DEEP DOWN LIGHT 12W', watt: '12W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Extremely slim LED Panel', 'High Power Factor', 'Surge Protection upto 2.5KV', 'Die cast aluminum body'] },
            { name: 'Ultra DEEP DOWN LIGHT 18W', watt: '18W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Extremely slim LED Panel', 'High Power Factor', 'Surge Protection upto 2.5KV', 'Die cast aluminum body'] },
            { name: 'Ultra DEEP DOWN LIGHT 22W', watt: '22W', shape: 'Round', cct: '6K, 5K, 4K, 3K, 3IN1', features: ['Extremely slim LED Panel', 'High Power Factor', 'Surge Protection upto 2.5KV', 'Die cast aluminum body'] }
        ]
    },
    {
        category: 'LED Junction Light',
        products: [
            { name: 'Mini Big JUNCTION LIGHT 4W', watt: '4W', shape: 'Round Mini', cct: '6K, 4K, 3K, C+W+N', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker'] },
            { name: 'Mini Big JUNCTION LIGHT 7W', watt: '7W', shape: 'Round Big', cct: '6K, 4K, 3K, C+W+N', features: ['In-built driver', 'Polycarbonate Body', 'Anti-flicker'] },
            { name: 'Cob JUNCTION LIGHT 3W', watt: '3W', shape: 'Round COB', cct: '6K, 4K, 3K, C+W+N', features: ['Ideal for niche area', 'Aluminium body with heat sink', 'Best for product highlighting'] },
            { name: 'Rembow JUNCTION LIGHT 7W+7W', watt: '14W', shape: 'Round', cct: 'CW+RED, CW+BLUE, CW+GREEN, CW+PINK', features: ['Frameless LED', 'Ultra slim round concealed dual color', 'Switch power on/off to change mode'] },
            { name: 'Rembow JUNCTION LIGHT 12W+12W', watt: '24W', shape: 'Round', cct: 'CW+RED, CW+BLUE, CW+GREEN, CW+PINK', features: ['Frameless LED', 'Ultra slim round concealed dual color', 'Switch power on/off to change mode'] }
        ]
    },
    {
        category: 'LED Bulb/Tube Light',
        products: [
            { name: 'Bulb LIGHT 9W', watt: '9W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT 15W', watt: '15W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT 18W', watt: '18W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT 30W', watt: '30W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT 40W', watt: '40W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT 50W', watt: '50W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Bulb LIGHT DRIVERLESS 12W', watt: '12W', shape: 'Bulb', cct: 'CW', features: ['Light, Polycarbonate Body', 'Driverless'] },
            { name: 'Tube LIGHT 20W', watt: '20W', shape: 'Tube', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Tube LIGHT 36W', watt: '36W', shape: 'Tube', cct: 'CW', features: ['Light, Polycarbonate Body', 'In-built driver'] },
            { name: 'Tube LIGHT Aluminium 36W', watt: '36W', shape: 'Tube', cct: 'CW', features: ['Aluminium body', 'In-built driver'] }
        ]
    },
    {
        category: 'LED Bulkhead Light',
        products: [
            { name: 'Ovel BULKHEAD LIGHT 9W', watt: '9W', shape: 'Oval', cct: 'CW, WW', features: ['Waterproof and corrosion-resistant', 'Classic bulkhead light', 'Easy to mount'] },
            { name: 'Ovel BULKHEAD LIGHT 18W', watt: '18W', shape: 'Oval', cct: 'CW, WW', features: ['Waterproof and corrosion-resistant', 'Classic bulkhead light', 'Easy to mount'] }
        ]
    },
    {
        category: 'LED Spot Light',
        products: [
            { name: 'Batan SPOT LIGHT 2W', watt: '2W', shape: 'Round', cct: 'CW, WW, NW', features: ['Ideal for niche area', 'Aluminium body with heat sink', 'Best for product highlighting'] },
            { name: 'Matel SPOT LIGHT 3W', watt: '3W', shape: 'Metal Curve', cct: 'CW, WW, NW', features: ['Ideal for niche area', 'Aluminium body with heat sink', 'Best for product highlighting'] },
            { name: 'SPOT LIGHT Curve 3W', watt: '3W', shape: 'Curve', cct: 'CW, WW, NW', features: ['Ideal for niche area', 'Aluminium body with heat sink', 'Best for product highlighting'] },
            { name: 'CYLINDER LIGHT Ring 3W', watt: '3W', shape: 'Round', cct: 'CW, WW, NW', features: ['Ideal for niche area', 'Aluminium body with heat sink', 'Best for product highlighting'] }
        ]
    },
    {
        category: 'LED COB Light',
        products: [
            { name: 'Creta COB LIGHT 7W', watt: '7W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Matt, diffused lens', 'Swivel mechanism to focus light', 'Die cast aluminium body'] },
            { name: 'Creta COB LIGHT 12W', watt: '12W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Matt, diffused lens', 'Swivel mechanism to focus light', 'Die cast aluminium body'] },
            { name: 'Creta COB LIGHT 18W', watt: '18W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Matt, diffused lens', 'Swivel mechanism to focus light', 'Die cast aluminium body'] },
            { name: 'Delta COB LIGHT 7W', watt: '7W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] },
            { name: 'Delta COB LIGHT 12W', watt: '12W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] },
            { name: 'Delta COB LIGHT 18W', watt: '18W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] },
            { name: 'Creta COB CYLINDER LIGHT 7W', watt: '7W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] },
            { name: 'Creta COB CYLINDER LIGHT 12W', watt: '12W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] },
            { name: 'Creta COB CYLINDER LIGHT 18W', watt: '18W', shape: 'Round', cct: 'CW, WW, NW, 3IN1', features: ['High bright COB down light', 'Heat sink for heat management', 'Die cast aluminium body'] }
        ]
    },
    {
        category: 'LED Street Light',
        products: [
            { name: 'Lens STREET LIGHT 24W', watt: '24W', shape: 'Street', cct: 'CW, WW, NW', features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'Pressure die cast aluminium'] },
            { name: 'Lens STREET LIGHT 36W', watt: '36W', shape: 'Street', cct: 'CW, WW, NW', features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'Pressure die cast aluminium'] },
            { name: 'Lens STREET LIGHT 50W', watt: '50W', shape: 'Street', cct: 'CW, WW, NW', features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'Pressure die cast aluminium'] },
            { name: 'Lens STREET LIGHT 72W', watt: '72W', shape: 'Street', cct: 'CW, WW, NW', features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'Pressure die cast aluminium'] },
            { name: 'Lens STREET LIGHT 100W', watt: '100W', shape: 'Street', cct: 'CW, WW, NW', features: ['Clear, high grade lens', 'High surge protection', 'IP65 rated, water proof', 'Pressure die cast aluminium'] }
        ]
    },
    {
        category: 'LED Flood Light',
        products: [
            { name: 'X series FLOOD LIGHT 50W', watt: '50W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'X series FLOOD LIGHT 100W', watt: '100W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'X series FLOOD LIGHT 200W', watt: '200W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'Back Chock FLOOD LIGHT 100W', watt: '100W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'Back Chock FLOOD LIGHT 150W', watt: '150W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'Back Chock FLOOD LIGHT 200W', watt: '200W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'Back Chock FLOOD LIGHT 300W', watt: '300W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] },
            { name: 'Back Chock FLOOD LIGHT 400W', watt: '400W', shape: 'Flood', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'High surge protection'] }
        ]
    },
    {
        category: 'LED Highbay Light',
        products: [
            { name: 'High Bay FLOOD LIGHT 100W', watt: '100W', shape: 'Highbay', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'Specially designed heat sink'] },
            { name: 'High Bay FLOOD LIGHT 150W', watt: '150W', shape: 'Highbay', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'Specially designed heat sink'] },
            { name: 'High Bay FLOOD LIGHT 200W', watt: '200W', shape: 'Highbay', cct: 'CW, WW, NW', features: ['Die cast metal body', 'Dust & water proof with IP65 protection', 'Specially designed heat sink'] }
        ]
    },
    {
        category: 'LED Strip Light',
        products: [
            { name: 'Wired ROPE LIGHT 120 10MM', watt: '120', shape: 'Rope', cct: 'CW, WW, NW, GREEN, BLUE, PINK', features: ['50 MTR Roll', 'LED Strip'] },
            { name: 'Wired ROPE LIGHT 60 10MM', watt: '60', shape: 'Rope', cct: 'CW, WW, NW, GREEN, BLUE, PINK', features: ['50 MTR Roll', 'LED Strip'] },
            { name: 'Strip PROFILE STRIP LIGHT 18W', watt: '18W', shape: 'Strip', cct: 'CW, WW, NW', features: ['Ip20', '5 MTR Roll'] }
        ]
    }
];

function generateSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function seedData() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB via', uri);

        let totalProducts = 0;
        let totalCategories = 0;

        for (const catData of catalogueData) {
            // Find or create category
            let category = await Category.findOne({ name: catData.category });
            if (!category) {
                category = await Category.create({
                    name: catData.category,
                    slug: generateSlug(catData.category),
                    description: `Premium ${catData.category}s from the new catalogue`,
                    status: 'active'
                });
                console.log(`Created Category: ${category.name}`);
                totalCategories++;
            }

            // Insert products
            for (const prodData of catData.products) {
                const existingProduct = await Product.findOne({ name: prodData.name });
                if (!existingProduct) {
                    await Product.create({
                        name: prodData.name,
                        slug: generateSlug(prodData.name),
                        category: category._id,
                        watt: prodData.watt,
                        cct: prodData.cct,
                        features: prodData.features,
                        description: `High-quality ${prodData.name} part of the ${catData.category} collection.`,
                        isActive: true
                    });
                    console.log(`Added Product: ${prodData.name}`);
                    totalProducts++;
                }
            }
        }

        console.log(`\nImport Summary:\n================\nCategories Added: ${totalCategories}\nProducts Added: ${totalProducts}\n`);
    } catch (e) {
        console.error('Error importing:', e);
    } finally {
        await mongoose.disconnect();
    }
}

seedData();
