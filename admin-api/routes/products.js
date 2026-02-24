const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products - Get all products (admin)
router.get('/', async (req, res) => {
    try {
        const { category, status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
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

// GET /api/products/stats/overview - Get product stats
router.get('/stats/overview', async (req, res) => {
    try {
        const total = await Product.countDocuments();
        const active = await Product.countDocuments({ status: 'active' });
        const inactive = await Product.countDocuments({ status: 'inactive' });

        res.json({ total, active, inactive });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug');

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
            name, category, description,
            watt, cct, lumen,
            features, applications, specifications,
            isActive, image, datasheet
        } = req.body;

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const product = new Product({
            name, category, description,
            watt, cct, lumen,
            features: features || [],
            applications: applications || [],
            specifications: specifications || {},
            isActive: isActive !== undefined ? isActive : true,
            image: image || '',
            datasheet: datasheet || ''
        });

        await product.save();

        // Populate category for response
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
        const {
            name, category, description,
            watt, cct, lumen,
            features, applications, specifications,
            isActive, image, datasheet
        } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify category if changed
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            product.category = category;
        }

        if (name) {
            product.name = name;
            product.slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        if (description !== undefined) product.description = description;
        if (watt !== undefined) product.watt = watt;
        if (cct !== undefined) product.cct = cct;
        if (lumen !== undefined) product.lumen = lumen;
        if (features) product.features = features;
        if (applications) product.applications = applications;
        if (specifications) product.specifications = { ...product.specifications, ...specifications };
        if (isActive !== undefined) product.isActive = isActive;
        if (image !== undefined) product.image = image;
        if (datasheet !== undefined) product.datasheet = datasheet;

        await product.save();
        await product.populate('category', 'name slug');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/products/:id - Delete product
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

router.patch('/:id/status', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = product.status === 'active' ? 'inactive' : 'active';
        await product.save();
        await product.populate('category', 'name slug');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
