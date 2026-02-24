const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - Get all categories (admin)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/categories - Create category
router.post('/', async (req, res) => {
    try {
        const { name, description, isActive, order, bannerImage } = req.body;

        const category = new Category({
            name,
            description,
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0,
            bannerImage: bannerImage || ''
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
    try {
        const { name, description, isActive, order, bannerImage } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;
        if (order !== undefined) category.order = order;
        if (bannerImage !== undefined) category.bannerImage = bannerImage;

        // Regenerate slug if name changed
        if (name) {
            category.slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/categories/:id/status - Toggle status
router.patch('/:id/status', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.isActive = !category.isActive;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
