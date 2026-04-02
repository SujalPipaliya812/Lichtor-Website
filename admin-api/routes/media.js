const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Media = require('../models/Media');
const { protect, authorize } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lichtor-web',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf'], 
        resource_type: 'auto',
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Invalid file type'));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter
});

// Helper to determine file type
const getFileType = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'document';
    if (mimetype.startsWith('video/')) return 'video';
    return 'other';
};

// @route   GET /api/media
// @desc    Get all media files
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type, folder, page = 1, limit = 20 } = req.query;

        let query = {};
        if (type) query.type = type;
        if (folder) query.folder = folder;

        const media = await Media.find(query)
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Media.countDocuments(query);

        res.json({
            media,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/media/upload
// @desc    Upload a file
// @access  Private/Admin,Editor
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const media = await Media.create({
            filename: req.file.filename, // This will be the Cloudinary public_id
            originalName: req.file.originalname,
            url: req.file.path, // Cloudinary provides secure URL here
            type: getFileType(req.file.mimetype),
            mimeType: req.file.mimetype,
            size: req.file.size,
            folder: req.body.folder || 'general',
            alt: req.body.alt || '',
            uploadedBy: req.user._id
        });

        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/media/upload-multiple
// @desc    Upload multiple files
// @access  Private/Admin,Editor
router.post('/upload-multiple', protect, authorize('admin', 'editor'), upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload files' });
        }

        const mediaItems = await Promise.all(
            req.files.map(file =>
                Media.create({
                    filename: file.filename, // Cloudinary public_id
                    originalName: file.originalname,
                    url: file.path, // Cloudinary secure URL
                    type: getFileType(file.mimetype),
                    mimeType: file.mimetype,
                    size: file.size,
                    folder: req.body.folder || 'general',
                    uploadedBy: req.user._id
                })
            )
        );

        res.status(201).json(mediaItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/media/:id
// @desc    Update media details
// @access  Private/Admin,Editor
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const media = await Media.findByIdAndUpdate(
            req.params.id,
            { alt: req.body.alt, folder: req.body.folder },
            { new: true }
        );

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        res.json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/media/:id
// @desc    Delete a media file
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // Delete file from Cloudinary using its public_id
        if (media.filename && !media.filename.includes('.')) {
            // Check if it looks like a public_id (no extension). Cloudinary defaults to dropping .ext in public_id.
            try {
                await cloudinary.uploader.destroy(media.filename);
            } catch (err) {
                console.error("Error deleting from Cloudinary:", err);
            }
        }

        await Media.findByIdAndDelete(req.params.id);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
