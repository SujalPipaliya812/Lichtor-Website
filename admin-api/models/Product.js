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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
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
    watt: { type: String, default: '' },
    cct: { type: String, default: '' },
    lumen: { type: String, default: '' },

    // Keeping specifications object for backward compatibility if needed, 
    // but primary fields are now top-level as per spec.
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
    image: {
        type: String,
        default: ''
    },
    datasheet: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
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

// Virtual for populating category details
ProductSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
