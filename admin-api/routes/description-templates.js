const express = require('express');
const router = express.Router();
const DescriptionTemplate = require('../models/DescriptionTemplate');

// GET all templates
router.get('/', async (req, res) => {
    try {
        const templates = await DescriptionTemplate.find().sort({ name: 1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST create template
router.post('/', async (req, res) => {
    try {
        const template = new DescriptionTemplate(req.body);
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT update template
router.put('/:id', async (req, res) => {
    try {
        const template = await DescriptionTemplate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json(template);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE template
router.delete('/:id', async (req, res) => {
    try {
        const template = await DescriptionTemplate.findByIdAndDelete(req.params.id);
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
