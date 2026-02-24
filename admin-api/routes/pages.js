const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/pages
// @desc    Get all pages
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) query.status = status;

        const pages = await Page.find(query).sort({ order: 1, createdAt: -1 });

        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/pages/:id
// @desc    Get single page
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/pages/slug/:slug
// @desc    Get page by slug (for frontend)
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({
            slug: req.params.slug,
            status: 'published'
        });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/pages
// @desc    Create a page
// @access  Private/Admin,Editor
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const page = await Page.create(req.body);
        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/pages/:id
// @desc    Update a page
// @access  Private/Admin,Editor
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const page = await Page.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/pages/:id
// @desc    Delete a page
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const page = await Page.findByIdAndDelete(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json({ message: 'Page deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
