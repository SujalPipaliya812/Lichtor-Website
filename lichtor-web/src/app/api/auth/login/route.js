import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
        }

        // Seed admin if no users exist
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.create({ name: 'Admin', email: 'admin@lichtor.com', password: 'admin123', role: 'admin' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.matchPassword(password))) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ message: 'Account is deactivated' }, { status: 401 });
        }

        const token = signToken({ id: user._id, email: user.email, role: user.role });

        return NextResponse.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
