import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    enquiryType: { type: String, enum: ['general', 'product', 'bulk', 'dealer', 'other'], default: 'general' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    message: { type: String, required: [true, 'Message is required'] },
    status: { type: String, enum: ['new', 'contacted', 'negotiating', 'converted', 'closed'], default: 'new' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    source: { type: String, enum: ['website', 'phone', 'email', 'referral', 'other'], default: 'website' }
}, { timestamps: true });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
