const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products - Get all products (admin)
router.get('/', async (req, res) => {
    try {
        const { category, status, search, sort, page = 1, limit = 50 } = req.query;

        let query = {};
        if (category) query.category = category;
        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'name') sortObj = { name: 1 };
        if (sort === 'category') sortObj = { category: 1, name: 1 };
        if (sort === 'order') sortObj = { displayOrder: 1 };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/products/stats/overview
router.get('/stats/overview', async (req, res) => {
    try {
        const total = await Product.countDocuments();
        const active = await Product.countDocuments({ isActive: true });
        const inactive = await Product.countDocuments({ isActive: false });
        res.json({ total, active, inactive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('similarProducts', 'name slug image category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/products - Create product
router.post('/', async (req, res) => {
    try {
        const {
            name, category, description, shortDescription, longDescription,
            sku, watt, cct, lumen, pkg, wattTable, types,
            features, applications, specifications, specCards,
            bodyColors, colorOptions,
            isActive, image, gallery, datasheet,
            similarProducts, displayOrder,
            metaTitle, metaDescription, descriptionTemplate
        } = req.body;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const product = new Product({
            name, category, description,
            shortDescription: shortDescription || '',
            longDescription: longDescription || '',
            sku: sku || '',
            watt, cct, lumen,
            pkg: pkg || '',
            wattTable: wattTable || [],
            types: types || [],
            features: features || [],
            applications: applications || [],
            specifications: specifications || {},
            specCards: specCards || [],
            bodyColors: bodyColors || [],
            colorOptions: colorOptions || [],
            isActive: isActive !== undefined ? isActive : true,
            image: image || '',
            gallery: gallery || [],
            datasheet: datasheet || '',
            similarProducts: similarProducts || [],
            displayOrder: displayOrder || 0,
            metaTitle: metaTitle || '',
            metaDescription: metaDescription || '',
            descriptionTemplate: descriptionTemplate || ''
        });

        await product.save();
        await product.populate('category', 'name slug');

        res.status(201).json(product);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const fields = [
            'name', 'category', 'description', 'shortDescription', 'longDescription',
            'sku', 'watt', 'cct', 'lumen', 'pkg', 'wattTable', 'types',
            'features', 'applications', 'specCards',
            'bodyColors', 'colorOptions',
            'isActive', 'image', 'gallery', 'datasheet',
            'similarProducts', 'displayOrder',
            'metaTitle', 'metaDescription', 'descriptionTemplate'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // Handle specifications as merge
        if (req.body.specifications) {
            product.specifications = { ...product.specifications?.toObject?.() || {}, ...req.body.specifications };
        }

        // Re-generate slug if name changed
        if (req.body.name) {
            product.slug = req.body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        await product.save();
        await product.populate('category', 'name slug');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/products/:id/duplicate - Duplicate product
router.post('/:id/duplicate', async (req, res) => {
    try {
        const source = await Product.findById(req.params.id).lean();
        if (!source) {
            return res.status(404).json({ message: 'Product not found' });
        }

        delete source._id;
        delete source.__v;
        source.name = source.name + ' (Copy)';
        source.slug = source.slug + '-copy-' + Date.now();
        source.createdAt = new Date();
        source.updatedAt = new Date();

        const duplicate = new Product(source);
        await duplicate.save();
        await duplicate.populate('category', 'name slug');

        res.status(201).json(duplicate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/products/:id/generate-description - AI Description generate
router.post('/:id/generate-description', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryName = product.category?.name || 'LED';
        const name = product.name;
        const watt = product.watt || '';
        const colors = (product.bodyColors || []).join(', ') || 'multiple color options';
        const feats = (product.features || []).slice(0, 4).join(', ') || 'energy efficient, high performance';

        const shortDescription = `${name} — a premium ${categoryName.toLowerCase()} LED lighting solution${watt ? ` with ${watt}W power output` : ''}. Available in ${colors}. Designed for superior brightness, energy efficiency, and long-lasting performance.`;

        const longDescription = `Experience superior illumination with the ${name} from LICHTOR. This professional-grade ${categoryName.toLowerCase()} LED light${watt ? ` delivers powerful ${watt}W output` : ''} with exceptional energy efficiency and uniform lighting distribution. Built using premium quality materials and advanced LED technology, it provides reliable and long-lasting performance for residential, commercial, and industrial applications.

Available in ${colors}, the ${name} offers versatile installation options with modern aesthetics that complement any space. Key highlights include ${feats}. With stable lighting output and enhanced durability, this product reduces maintenance costs while maintaining consistent brightness.

LICHTOR LED products are engineered to meet the highest industry standards, ensuring safety, performance, and customer satisfaction. Illuminate your space with dependable lighting performance from LICHTOR.`;

        const highlights = [
            `Premium ${categoryName.toLowerCase()} LED with${watt ? ` ${watt}W` : ''} high-efficiency output`,
            `Available in ${colors} to suit different environments`,
            `Advanced LED technology for uniform brightness and long lifespan`,
            `Easy installation with modern, space-efficient design`
        ];

        const metaDescription = `Buy ${name} from LICHTOR — premium ${categoryName.toLowerCase()} LED lighting${watt ? `, ${watt}W` : ''}. Energy efficient, long-lasting, available in ${colors}. Request a quote today.`;

        res.json({
            shortDescription,
            longDescription,
            highlights,
            metaDescription
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/products/:id/status - Toggle status
router.patch('/:id/status', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.isActive = !product.isActive;
        await product.save();
        await product.populate('category', 'name slug');
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
