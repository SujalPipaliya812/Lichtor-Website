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

// ============ ROUTES (always registered, DB init handled by middleware) ============
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const mediaRoutes = require('./routes/media');
const enquiryRoutes = require('./routes/enquiries');
const pageRoutes = require('./routes/pages');
const descTemplateRoutes = require('./routes/description-templates');

// Setup routes - called once DB is confirmed connected
const setupRoutes = () => {
    app.use('/api/auth', authRoutes);
    app.use('/api/public', publicRoutes);
    app.use('/api/categories', protect, categoryRoutes);
    app.use('/api/products', protect, productRoutes);
    app.use('/api/media', protect, mediaRoutes);
    app.use('/api/enquiries', protect, enquiryRoutes);
    app.use('/api/pages', protect, pageRoutes);
    app.use('/api/description-templates', protect, descTemplateRoutes);
    console.log('📦 Routes registered with MongoDB');
};


// Demo mode routes (in-memory)
const setupDemoRoutes = () => {
    // Demo Auth Routes
    app.post('/api/auth/login', async (req, res) => {
        const { email, password } = req.body;
        const user = demoUsers.find(u => u.email === email && u.password === password);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    });

    app.get('/api/auth/me', protect, (req, res) => {
        const user = demoUsers.find(u => u._id === req.user.id);
        if (user) res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        else res.status(404).json({ message: 'User not found' });
    });

    // Public routes
    app.get('/api/public/categories', (req, res) => {
        res.json(demoCategories.filter(c => c.status === 'active'));
    });

    app.get('/api/public/categories/:slug', (req, res) => {
        const category = demoCategories.find(c => c.slug === req.params.slug && c.status === 'active');
        if (!category) return res.status(404).json({ message: 'Not found' });
        res.json(category);
    });

    app.get('/api/public/categories/:slug/products', (req, res) => {
        const category = demoCategories.find(c => c.slug === req.params.slug && c.status === 'active');
        if (!category) return res.status(404).json({ message: 'Category not found' });
        const products = demoProducts.filter(p => p.category === category._id && p.status === 'active');
        res.json({ category, products: products.map(p => ({ ...p, category })) });
    });

    app.get('/api/public/products', (req, res) => {
        const products = demoProducts
            .filter(p => p.status === 'active')
            .map(p => {
                const cat = demoCategories.find(c => c._id === p.category);
                return { ...p, category: cat || null };
            });
        res.json(products);
    });

    app.get('/api/public/products/:slug', (req, res) => {
        const product = demoProducts.find(p => p.slug === req.params.slug && p.status === 'active');
        if (!product) return res.status(404).json({ message: 'Not found' });
        const cat = demoCategories.find(c => c._id === product.category);
        res.json({ ...product, category: cat || null });
    });

    app.post('/api/public/enquiry', (req, res) => {
        console.log('New Enquiry:', req.body);
        res.json({ success: true, message: 'Enquiry submitted successfully' });
    });

    // Admin category routes
    app.get('/api/categories', protect, (req, res) => {
        res.json(demoCategories);
    });

    app.post('/api/categories', protect, (req, res) => {
        const { name, description, status } = req.body;
        const category = {
            _id: String(++demoIdCounter),
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: description || '',
            status: status || 'active',
            order: demoCategories.length,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        demoCategories.push(category);
        res.status(201).json(category);
    });

    app.put('/api/categories/:id', protect, (req, res) => {
        const index = demoCategories.findIndex(c => c._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });
        demoCategories[index] = { ...demoCategories[index], ...req.body, updatedAt: new Date() };
        if (req.body.name) {
            demoCategories[index].slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        res.json(demoCategories[index]);
    });

    app.delete('/api/categories/:id', protect, (req, res) => {
        demoCategories = demoCategories.filter(c => c._id !== req.params.id);
        res.json({ message: 'Deleted' });
    });

    app.patch('/api/categories/:id/status', protect, (req, res) => {
        const index = demoCategories.findIndex(c => c._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });
        demoCategories[index].status = demoCategories[index].status === 'active' ? 'inactive' : 'active';
        res.json(demoCategories[index]);
    });

    // Admin product routes
    app.get('/api/products', protect, (req, res) => {
        const products = demoProducts.map(p => {
            const cat = demoCategories.find(c => c._id === p.category);
            return { ...p, category: cat || null };
        });
        res.json({ products, total: products.length, totalPages: 1, currentPage: 1 });
    });

    app.get('/api/products/stats/overview', protect, (req, res) => {
        res.json({
            total: demoProducts.length,
            active: demoProducts.filter(p => p.status === 'active').length,
            inactive: demoProducts.filter(p => p.status === 'inactive').length
        });
    });

    app.post('/api/products', protect, (req, res) => {
        const { name, category, description, features, applications, specifications, status } = req.body;
        const cat = demoCategories.find(c => c._id === category);
        if (!cat) return res.status(400).json({ message: 'Invalid category' });

        const product = {
            _id: String(++demoIdCounter),
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category,
            description: description || '',
            features: features || [],
            applications: applications || [],
            specifications: specifications || {},
            status: status || 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        demoProducts.push(product);
        res.status(201).json({ ...product, category: cat });
    });

    app.put('/api/products/:id', protect, (req, res) => {
        const index = demoProducts.findIndex(p => p._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });
        demoProducts[index] = { ...demoProducts[index], ...req.body, updatedAt: new Date() };
        if (req.body.name) {
            demoProducts[index].slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        const cat = demoCategories.find(c => c._id === demoProducts[index].category);
        res.json({ ...demoProducts[index], category: cat });
    });

    app.delete('/api/products/:id', protect, (req, res) => {
        demoProducts = demoProducts.filter(p => p._id !== req.params.id);
        res.json({ message: 'Deleted' });
    });

    app.patch('/api/products/:id/status', protect, (req, res) => {
        const index = demoProducts.findIndex(p => p._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Not found' });
        demoProducts[index].status = demoProducts[index].status === 'active' ? 'inactive' : 'active';
        const cat = demoCategories.find(c => c._id === demoProducts[index].category);
        res.json({ ...demoProducts[index], category: cat });
    });

    // Dashboard stats
    app.get('/api/enquiries/stats/overview', protect, (req, res) => {
        res.json({ total: 0, new: 0, contacted: 0, converted: 0, recent: [] });
    });
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

// ----- Vercel / Local startup -----
// We initialize DB + routes once and expose the app.
// A middleware guards all requests until initialization is done.

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

// Middleware: wait for init before handling any request
app.use((req, res, next) => {
    initialize().then(next).catch(next);
});

if (process.env.VERCEL) {
    // Kick off initialization immediately so it's ready for the first request
    initialize();
} else {
    startServer();
}

module.exports = app;
