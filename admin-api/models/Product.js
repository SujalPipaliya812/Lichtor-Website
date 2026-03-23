const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    sku: {
        type: String,
        default: '',
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    shortDescription: {
        type: String,
        default: ''
    },
    longDescription: {
        type: String,
        default: ''
    },
    // Legacy field kept for backward compat
    description: {
        type: String,
        default: ''
    },
    features: [{
        type: String
    }],
    applications: [{
        type: String
    }],
    bodyColors: [{
        type: String
    }],
    colorOptions: [{
        type: String
    }],
    pkg: { type: String, default: '' },
    watt: { type: String, default: '' },
    cct: { type: String, default: '' },
    lumen: { type: String, default: '' },
    wattTable: [{
        watt: { type: String, default: '' },
        lumen: { type: String, default: '' },
        cct: { type: String, default: '' },
        current: { type: String, default: '' }
    }],
    types: [{
        name: { type: String, default: '' },
        bodyColors: [{ type: String }]
    }],

    specifications: {
        voltage: { type: String, default: '' },
        cri: { type: String, default: '' },
        beamAngle: { type: String, default: '' },
        ipRating: { type: String, default: '' },
        lifespan: { type: String, default: '' },
        dimensions: { type: String, default: '' },
        material: { type: String, default: '' },
        warranty: { type: String, default: '' }
    },

    // Specification display cards (icon + title + text)
    specCards: [{
        icon: { type: String, default: '' },
        title: { type: String, default: '' },
        text: { type: String, default: '' }
    }],

    image: {
        type: String,
        default: ''
    },
    gallery: [{
        type: String
    }],
    datasheet: {
        type: String,
        default: ''
    },

    similarProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    displayOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    descriptionTemplate: { type: String, default: '' }
}, {
    timestamps: true
});

// Auto-generate slug from name before validation
ProductSchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

ProductSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
