require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
let isMongoConnected = false;

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lichtor_admin';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected');
        isMongoConnected = true;
        return true;
    } catch (error) {
        console.log('⚠️  MongoDB not available - Running in Demo Mode');
        console.log('   To use MongoDB: brew services start mongodb-community');
        return false;
    }
};

// JWT helpers for demo mode
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'lichtor-secret-key-2024';

// Demo users
const demoUsers = [
    { _id: '1', name: 'Admin', email: 'admin@lichtor.com', password: 'admin123', role: 'admin' }
];

// Demo data (fallback when MongoDB not available)
let demoCategories = [];
let demoProducts = [];
let demoIdCounter = 1000;

const User = require('./models/User');

// Auth middleware
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Token invalid' });
        }
    }
    return res.status(401).json({ message: 'Not authorized' });
};

// Seed Admin User
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@lichtor.com' });
        if (!adminExists) {
            console.log('🌱 Seeding admin user...');
            await User.create({
                name: 'Admin',
                email: 'admin@lichtor.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Admin user created: admin@lichtor.com / admin123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// ============ INITIALIZATION (Handles Vercel Cold Starts) ============
let initPromise = null;

const initialize = () => {
    if (!initPromise) {
        initPromise = connectDB().then(() => {
            if (isMongoConnected) seedAdmin();
            setupRoutes();
        });
    }
    return initPromise;
};

// Middleware: MUST be the first thing to run to ensure DB is ready
app.use(async (req, res, next) => {
    // Avoid re-initializing for direct status checks if needed, 
    // but generally we want to ensure DB is ready for all /api calls.
    if (req.path.startsWith('/api')) {
        try {
            await initialize();
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// ============ ROUTES ============
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const mediaRoutes = require('./routes/media');
const enquiryRoutes = require('./routes/enquiries');
const pageRoutes = require('./routes/pages');
const descTemplateRoutes = require('./routes/description-templates');

const setupRoutes = () => {
    // Both /api/ and root level routes for compatibility
    const register = (path, ...handlers) => {
        app.use(`/api${path}`, ...handlers);
        app.use(path, ...handlers);
    };

    register('/auth', authRoutes);
    register('/public', publicRoutes);
    register('/categories', protect, categoryRoutes);
    register('/products', protect, productRoutes);
    register('/media', protect, mediaRoutes);
    register('/enquiries', protect, enquiryRoutes);
    register('/pages', protect, pageRoutes);
    register('/description-templates', protect, descTemplateRoutes);
    
    // Status endpoint
    app.get(['/api/status', '/status'], (req, res) => {
        res.json({ 
            status: 'running', 
            mongodb: isMongoConnected ? 'connected' : 'disconnected' 
        });
    });

    console.log('📦 Routes registered (root & /api)');
};

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'LICHTOR Admin API',
        version: '2.0.0',
        status: 'running'
    });
});

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
    await connectDB();
    if (isMongoConnected) {
        await seedAdmin();
    }
    setupRoutes();

    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`\n🚀 LICHTOR Admin API running on port ${PORT}\n`);
        });
    }
};

if (process.env.VERCEL) {
    // On Vercel, initialization happens on the first request via middleware
    console.log('🚀 Running on Vercel');
} else {
    // Start locally
    startServer();
}

module.exports = app;
