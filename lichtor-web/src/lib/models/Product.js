import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    series: { type: String, default: '' },
    model: { type: String, default: '' },
    features: [{ type: String }],
    applications: [{ type: String }],
    bodyColors: [{ type: String }],
    colorOptions: [{ type: String }],
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    watt: { type: String, default: '' },
    cct: { type: String, default: '' },
    lumen: { type: String, default: '' },
    pkg: { type: String, default: '' },
    wattTable: [{
        watt: { type: String, default: '' },
        lumen: { type: String, default: '' },
        cct: { type: String, default: '' },
        current: { type: String, default: '' },
    }],
    types: [{
        name: { type: String, default: '' },
        wattages: [{ type: String }],
    }],
    specifications: {
        voltage: { type: String, default: '' },
        cri: { type: String, default: '' },
        beamAngle: { type: String, default: '' },
        ipRating: { type: String, default: '' },
        lifespan: { type: String, default: '' },
        dimensions: { type: String, default: '' },
        material: { type: String, default: '' },
        warranty: { type: String, default: '' },
        efficacy: { type: String, default: '' },
        powerFactor: { type: String, default: '' },
        cutoutSize: { type: String, default: '' },
        certifications: { type: String, default: '' },
    },
    specCards: [{
        icon: { type: String, default: '' },
        title: { type: String, default: '' },
        text: { type: String, default: '' }
    }],
    similarProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    images: [{ type: String }],
    datasheet: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    descriptionTemplate: { type: String, default: '' }
}, { timestamps: true });

ProductSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
