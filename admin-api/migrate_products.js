/**
 * migrate_products.js
 * Consolidates individual wattage-specific products into grouped family products.
 * Each family has: name, types ([{name, wattages}]), and shared features/watt summary.
 * Run:  node migrate_products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lichtor_admin';

/* ─── Define product families ─────────────────────────────────────────────── */
const families = [
    {
        categorySlug: 'led-panel-light',
        name: 'SSK Panel Light',
        description: 'Ultra-slim LED panel available in round and square shapes. Ideal for false ceiling installations.',
        features: ['High CRI > 80', 'Anti-Glare Diffuser', 'Available in Round & Square', 'Surge Protection', '50,000 Hrs Life'],
        watt: '8 / 15 / 22',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Round', wattages: ['8W', '15W', '22W'] },
            { name: 'Square', wattages: ['8W', '15W', '22W'] },
        ],
        wattTable: [
            { watt: '8', lumen: '700', cct: '3000K / 4000K / 6500K', current: '600mA' },
            { watt: '15', lumen: '1300', cct: '3000K / 4000K / 6500K', current: '900mA' },
            { watt: '22', lumen: '1900', cct: '3000K / 4000K / 6500K', current: '1200mA' },
        ],
        productsToDelete: [
            'ssk-panel-light-round-8w', 'ssk-panel-light-square-8w',
            'ssk-panel-light-round-15w', 'ssk-panel-light-square-15w',
            'ssk-panel-light-round-22w', 'ssk-panel-light-square-22w',
        ],
    },
    {
        categorySlug: 'led-surface-light',
        name: 'Moon Surface Light',
        description: 'Surface-mounted LED panel for ceilings without false ceiling. Easy installation and modern design.',
        features: ['Surface Mounted', 'Wide Beam Angle', 'Easy Installation', '50,000 Hrs Life', 'Driverless Option Available'],
        watt: '8 / 15 / 22',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Standard', wattages: ['8W', '15W', '22W'] },
            { name: 'Driverless Indoor', wattages: ['3W'] },
            { name: 'Driverless Outdoor', wattages: ['3W'] },
        ],
        wattTable: [
            { watt: '3', lumen: '240', cct: '6500K', current: '' },
            { watt: '8', lumen: '700', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '15', lumen: '1300', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '22', lumen: '1900', cct: '3000K / 4000K / 6500K', current: '' },
        ],
        productsToDelete: [
            'moon-surface-light-8w', 'moon-surface-light-15w', 'moon-surface-light-22w',
            'driverless-surface-light-indoor-3w', 'driverless-surface-light-outdoor-3w',
        ],
    },
    {
        categorySlug: 'led-down-light',
        name: 'Deep Down Light',
        description: 'Recessed ceiling downlighters for uniform ambient lighting. Multiple types and wattages available.',
        features: ['Precise Beam Angle', 'Anti-Glare', 'High CRI > 80', 'Slim Profile', '50,000 Hrs Life'],
        watt: '8 / 12 / 15 / 18 / 22',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Ecco', wattages: ['8W', '15W', '22W'] },
            { name: 'Regular', wattages: ['12W', '18W', '22W'] },
            { name: 'Ultra', wattages: ['12W', '18W', '22W'] },
        ],
        wattTable: [
            { watt: '8', lumen: '720', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '12', lumen: '1080', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '15', lumen: '1350', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '18', lumen: '1620', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '22', lumen: '1980', cct: '3000K / 4000K / 6500K', current: '' },
        ],
        productsToDelete: [
            'ecco-deep-down-light-8w', 'ecco-deep-down-light-15w', 'ecco-deep-down-light-22w',
            'regular-deep-down-light-12w', 'regular-deep-down-light-18w', 'regular-deep-down-light-22w',
            'ultra-deep-down-light-12w', 'ultra-deep-down-light-18w', 'ultra-deep-down-light-22w',
        ],
    },
    {
        categorySlug: 'led-junction-light',
        name: 'Junction Light',
        description: 'Quick-install junction box lights. Perfect for residential false ceiling applications.',
        features: ['Easy Junction Box Fit', 'Compact Design', 'Adjustable Beam', '50,000 Hrs Life'],
        watt: '4 / 7 / 12',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Mini', wattages: ['4W'] },
            { name: 'Big', wattages: ['7W'] },
            { name: 'COB', wattages: ['3W'] },
            { name: 'Rembow', wattages: ['7W+7W', '12W+12W'] },
        ],
        wattTable: [
            { watt: '3', lumen: '240', cct: '6500K', current: '' },
            { watt: '4', lumen: '360', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '7', lumen: '630', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '7+7', lumen: '1260', cct: '3000K / 4000K / 6500K', current: '' },
            { watt: '12+12', lumen: '2160', cct: '3000K / 4000K / 6500K', current: '' },
        ],
        productsToDelete: [
            'mini-big-junction-light-4w', 'mini-big-junction-light-7w',
            'cob-junction-light-3w', 'rembow-junction-light-7w7w', 'rembow-junction-light-12w12w',
        ],
    },
    {
        categorySlug: 'led-bulbtube-light',
        name: 'Bulb & Tube Light',
        description: 'Essential LED bulbs and tube lights for household and commercial use. Driverless option available.',
        features: ['Energy Efficient', 'Long Life', 'Wide Voltage Range', 'Eco-Friendly'],
        watt: '9 / 15 / 18 / 20 / 30 / 36 / 40 / 50',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Bulb', wattages: ['9W', '15W', '18W', '30W', '40W', '50W'] },
            { name: 'Bulb Driverless', wattages: ['12W'] },
            { name: 'Tube', wattages: ['20W', '36W'] },
            { name: 'Tube Aluminium', wattages: ['36W'] },
        ],
        wattTable: [
            { watt: '9', lumen: '810', cct: '3000K / 6500K', current: '' },
            { watt: '12', lumen: '1080', cct: '6500K', current: '' },
            { watt: '15', lumen: '1350', cct: '3000K / 6500K', current: '' },
            { watt: '18', lumen: '1620', cct: '3000K / 6500K', current: '' },
            { watt: '20', lumen: '1800', cct: '6500K', current: '' },
            { watt: '30', lumen: '2700', cct: '6500K', current: '' },
            { watt: '36', lumen: '3240', cct: '6500K', current: '' },
            { watt: '40', lumen: '3600', cct: '6500K', current: '' },
            { watt: '50', lumen: '4500', cct: '6500K', current: '' },
        ],
        productsToDelete: [
            'bulb-light-9w', 'bulb-light-15w', 'bulb-light-18w', 'bulb-light-30w',
            'bulb-light-40w', 'bulb-light-50w', 'bulb-light-driverless-12w',
            'tube-light-20w', 'tube-light-36w', 'tube-light-aluminium-36w',
        ],
    },
    {
        categorySlug: 'led-bulkhead-light',
        name: 'Ovel Bulkhead Light',
        description: 'Oval-shaped bulkhead lights for indoor and outdoor use. Weather resistant.',
        features: ['IP44 Rated', 'Impact Resistant', 'Easy Wall / Ceiling Mount', 'Long Life'],
        watt: '9 / 18',
        cct: 'CW, WW, NW',
        pkg: '5 pcs / box',
        types: [
            { name: 'Ovel', wattages: ['9W', '18W'] },
        ],
        wattTable: [
            { watt: '9', lumen: '720', cct: '6500K', current: '' },
            { watt: '18', lumen: '1440', cct: '6500K', current: '' },
        ],
        productsToDelete: ['ovel-bulkhead-light-9w', 'ovel-bulkhead-light-18w'],
    },
    {
        categorySlug: 'led-spot-light',
        name: 'LED Spot Light',
        description: 'Directional spot lights for accent and display illumination. Multiple styles available.',
        features: ['Directional Beam', 'Compact Body', 'High CRI', '50,000 Hrs Life'],
        watt: '2 / 3',
        cct: 'CW, WW, NW',
        pkg: '10 pcs / box',
        types: [
            { name: 'Batan', wattages: ['2W'] },
            { name: 'Metal', wattages: ['3W'] },
            { name: 'Curve', wattages: ['3W'] },
            { name: 'Cylinder Ring', wattages: ['3W'] },
        ],
        wattTable: [
            { watt: '2', lumen: '160', cct: '3000K / 6500K', current: '' },
            { watt: '3', lumen: '240', cct: '3000K / 4000K / 6500K', current: '' },
        ],
        productsToDelete: ['batan-spot-light-2w', 'matel-spot-light-3w', 'spot-light-curve-3w', 'cylinder-light-ring-3w'],
    },
    {
        categorySlug: 'led-cob-light',
        name: 'COB Down Light',
        description: 'High intensity Chip-on-Board lights for focused illumination. Ceiling recessed and cylinder options.',
        features: ['True Color Rendering CRI > 90', 'Focused Beam', 'Efficient Heat Dissipation', '50,000 Hrs Life'],
        watt: '7 / 12 / 18',
        cct: 'CW, WW, NW, 3IN1',
        pkg: '10 pcs / box',
        types: [
            { name: 'Creta', wattages: ['7W', '12W', '18W'] },
            { name: 'Delta', wattages: ['7W', '12W', '18W'] },
            { name: 'Creta Cylinder', wattages: ['7W', '12W', '18W'] },
        ],
        wattTable: [
            { watt: '7', lumen: '630', cct: '3000K / 4000K / 6500K / 3IN1', current: '' },
            { watt: '12', lumen: '1080', cct: '3000K / 4000K / 6500K / 3IN1', current: '' },
            { watt: '18', lumen: '1620', cct: '3000K / 4000K / 6500K / 3IN1', current: '' },
        ],
        productsToDelete: [
            'creta-cob-light-7w', 'creta-cob-light-12w', 'creta-cob-light-18w',
            'delta-cob-light-7w', 'delta-cob-light-12w', 'delta-cob-light-18w',
            'creta-cob-cylinder-light-7w', 'creta-cob-cylinder-light-12w', 'creta-cob-cylinder-light-18w',
        ],
    },
    {
        categorySlug: 'led-street-light',
        name: 'Lens Street Light',
        description: 'High efficiency LED street lights with lens technology for roads, highways, and urban areas.',
        features: ['IP65 Rated', 'Lens Optics', 'Wide Voltage Range', 'Anti-Corrosion Body', '50,000 Hrs Life'],
        watt: '24 / 36 / 50 / 72 / 100',
        cct: 'CW, WW, NW',
        pkg: '1 pc / box',
        types: [
            { name: 'Lens', wattages: ['24W', '36W', '50W', '72W', '100W'] },
        ],
        wattTable: [
            { watt: '24', lumen: '2640', cct: '6500K', current: '' },
            { watt: '36', lumen: '3960', cct: '6500K', current: '' },
            { watt: '50', lumen: '5500', cct: '6500K', current: '' },
            { watt: '72', lumen: '7920', cct: '6500K', current: '' },
            { watt: '100', lumen: '11000', cct: '6500K', current: '' },
        ],
        productsToDelete: [
            'lens-street-light-24w', 'lens-street-light-36w', 'lens-street-light-50w',
            'lens-street-light-72w', 'lens-street-light-100w',
        ],
    },
    {
        categorySlug: 'led-flood-light',
        name: 'LED Flood Light',
        description: 'Powerful LED flood lights for outdoor illumination of grounds, facades, and commercial areas.',
        features: ['IP65 Rated', 'Die Cast Aluminium', 'Wide Beam Angle', 'Anti-Rust', '50,000 Hrs Life'],
        watt: '50 / 100 / 150 / 200 / 300 / 400',
        cct: 'CW, WW, NW',
        pkg: '1 pc / box',
        types: [
            { name: 'X Series', wattages: ['50W', '100W', '200W'] },
            { name: 'Back Chock', wattages: ['100W', '150W', '200W', '300W', '400W'] },
        ],
        wattTable: [
            { watt: '50', lumen: '5500', cct: '6500K', current: '' },
            { watt: '100', lumen: '11000', cct: '6500K', current: '' },
            { watt: '150', lumen: '16500', cct: '6500K', current: '' },
            { watt: '200', lumen: '22000', cct: '6500K', current: '' },
            { watt: '300', lumen: '33000', cct: '6500K', current: '' },
            { watt: '400', lumen: '44000', cct: '6500K', current: '' },
        ],
        productsToDelete: [
            'x-series-flood-light-50w', 'x-series-flood-light-100w', 'x-series-flood-light-200w',
            'back-chock-flood-light-100w', 'back-chock-flood-light-150w', 'back-chock-flood-light-200w',
            'back-chock-flood-light-300w', 'back-chock-flood-light-400w',
        ],
    },
    {
        categorySlug: 'led-highbay-light',
        name: 'High Bay Flood Light',
        description: 'Industrial-grade high bay lights for warehouses, factories, and large commercial spaces.',
        features: ['IP65 Rated', 'Deep Bowl Reflector', 'High Lumen Output', 'High Ceiling Install', '50,000 Hrs Life'],
        watt: '100 / 150 / 200',
        cct: 'CW, WW, NW',
        pkg: '1 pc / box',
        types: [
            { name: 'High Bay', wattages: ['100W', '150W', '200W'] },
        ],
        wattTable: [
            { watt: '100', lumen: '12000', cct: '6500K', current: '' },
            { watt: '150', lumen: '18000', cct: '6500K', current: '' },
            { watt: '200', lumen: '24000', cct: '6500K', current: '' },
        ],
        productsToDelete: ['high-bay-flood-light-100w', 'high-bay-flood-light-150w', 'high-bay-flood-light-200w'],
    },
    {
        categorySlug: 'led-strip-light',
        name: 'LED Strip & Profile Light',
        description: 'Flexible LED rope and strip lights for cove lighting, under-cabinet, and profile channel mounting.',
        features: ['Flexible PCB', 'Cuttable Lengths', 'Profile Channel Compatible', 'Indoor Use'],
        watt: '10 / 18',
        cct: 'CW, WW',
        pkg: '5 mtr / roll',
        types: [
            { name: 'Rope Light 120 10MM', wattages: ['10W/mtr'] },
            { name: 'Rope Light 60 10MM', wattages: ['5W/mtr'] },
            { name: 'Profile Strip', wattages: ['18W'] },
        ],
        wattTable: [
            { watt: '5/mtr', lumen: '', cct: 'CW / WW', current: '' },
            { watt: '10/mtr', lumen: '', cct: 'CW / WW', current: '' },
            { watt: '18', lumen: '1440', cct: 'CW / WW', current: '' },
        ],
        productsToDelete: ['wired-rope-light-120-10mm', 'wired-rope-light-60-10mm', 'strip-profile-strip-light-18w'],
    },
];

/* ─── Migration runner ─────────────────────────────────────────────────────── */
async function run() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    let created = 0;
    let deleted = 0;
    let errors = 0;

    for (const family of families) {
        try {
            const category = await Category.findOne({ slug: family.categorySlug });
            if (!category) {
                console.warn(`  ⚠  Category not found: ${family.categorySlug}`);
                continue;
            }

            // Delete old individual products
            for (const slug of family.productsToDelete) {
                const res = await Product.deleteOne({ slug });
                if (res.deletedCount > 0) {
                    deleted++;
                }
            }

            // Build slug from name
            const slug = family.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Upsert the consolidated product
            await Product.findOneAndUpdate(
                { slug },
                {
                    name: family.name,
                    slug,
                    category: category._id,
                    description: family.description,
                    features: family.features,
                    watt: family.watt,
                    cct: family.cct,
                    pkg: family.pkg,
                    types: family.types,
                    wattTable: family.wattTable,
                    isActive: true,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log(`✓  [${family.categorySlug}] Created: ${family.name}  (${family.types.length} types, ${family.wattTable.length} watt rows)`);
            created++;
        } catch (err) {
            console.error(`✕  Error for ${family.name}:`, err.message);
            errors++;
        }
    }

    console.log(`\n===============================`);
    console.log(`Products created/updated : ${created}`);
    console.log(`Old products deleted     : ${deleted}`);
    console.log(`Errors                   : ${errors}`);
    console.log(`===============================`);
    mongoose.disconnect();
}

run().catch(err => { console.error(err); mongoose.disconnect(); });
