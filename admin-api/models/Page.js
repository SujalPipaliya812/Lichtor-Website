const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Page title is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String
    },
    excerpt: {
        type: String,
        maxlength: 300
    },
    featuredImage: {
        type: String
    },
    template: {
        type: String,
        enum: ['default', 'landing', 'contact', 'about'],
        default: 'default'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    ogImage: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    showInNav: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate slug before saving
pageSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Page', pageSchema);
