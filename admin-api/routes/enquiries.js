const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/enquiries
// @desc    Get all enquiries
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, priority, type, page = 1, limit = 20 } = req.query;

        let query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (type) query.enquiryType = type;

        const enquiries = await Enquiry.find(query)
            .populate('product', 'name slug')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Enquiry.countDocuments(query);

        res.json({
            enquiries,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/enquiries/stats
// @desc    Get enquiry statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
    try {
        const total = await Enquiry.countDocuments();
        const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
        const contacted = await Enquiry.countDocuments({ status: 'contacted' });
        const converted = await Enquiry.countDocuments({ status: 'converted' });

        const byType = await Enquiry.aggregate([
            { $group: { _id: '$enquiryType', count: { $sum: 1 } } }
        ]);

        const recent = await Enquiry.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email enquiryType status createdAt');

        res.json({
            total,
            new: newEnquiries,
            contacted,
            converted,
            byType,
            recent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id)
            .populate('product', 'name slug images')
            .populate('assignedTo', 'name email')
            .populate('notes.createdBy', 'name');

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/enquiries
// @desc    Create an enquiry (from website form)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.status(201).json({
            message: 'Enquiry submitted successfully',
            enquiryId: enquiry._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/enquiries/:id
// @desc    Update an enquiry
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/enquiries/:id/status
// @desc    Update enquiry status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;

        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/enquiries/:id/notes
// @desc    Add note to enquiry
// @access  Private
router.post('/:id/notes', protect, async (req, res) => {
    try {
        const { content } = req.body;

        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        enquiry.notes.push({
            content,
            createdBy: req.user._id
        });

        await enquiry.save();

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete an enquiry
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
