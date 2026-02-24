const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');

// @route   GET /api/public/categories
// @desc    Get all active categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({ status: 'active' })
            .sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/categories/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({
            slug: req.params.slug,
            status: 'active'
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/categories/:slug/products
// @desc    Get products by category slug
// @access  Public
router.get('/categories/:slug/products', async (req, res) => {
    try {
        const category = await Category.findOne({
            slug: req.params.slug
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await Product.find({
            category: category._id,
            status: 'active'
        }).populate('category', 'name slug');

        res.json({
            category,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/products
// @desc    Get all active products
// @access  Public
router.get('/products', async (req, res) => {
    try {
        const { limit = 100, category } = req.query;

        let query = { status: 'active' };

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) {
                query.category = cat._id;
            }
        }

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/public/products/:slug
// @desc    Get product by slug
// @access  Public
router.get('/products/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
            status: 'active'
        }).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/public/enquiry
// @desc    Submit product enquiry
// @access  Public
router.post('/enquiry', async (req, res) => {
    try {
        const { name, email, phone, company, message, product, productId } = req.body;

        const enquiry = new Enquiry({
            name,
            email,
            phone,
            company,
            message,
            subject: `Enquiry for: ${product || 'General'}`,
            source: 'website'
        });

        // Link to product if provided
        if (productId) {
            enquiry.product = productId;
        }

        await enquiry.save();

        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully. We will contact you soon!'
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit enquiry' });
    }
});

module.exports = router;
