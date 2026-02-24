const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'document', 'video', 'other'],
        default: 'image'
    },
    mimeType: {
        type: String
    },
    size: {
        type: Number
    },
    folder: {
        type: String,
        default: 'general'
    },
    alt: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema);
