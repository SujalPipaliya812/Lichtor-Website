const mongoose = require('mongoose');

const DescriptionTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Template name is required'],
        trim: true
    },
    category: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DescriptionTemplate', DescriptionTemplateSchema);
