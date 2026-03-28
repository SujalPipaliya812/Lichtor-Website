const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lichtor_admin';

async function resetAdmin() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        let user = await User.findOne({ email: 'admin@lichtor.com' });
        if (user) {
            console.log('User found, updating password...');
            user.password = 'admin123';
            await user.save();
            console.log('Password updated successfully');
        } else {
            console.log('User not found, creating new admin...');
            await User.create({
                name: 'Admin',
                email: 'admin@lichtor.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAdmin();
