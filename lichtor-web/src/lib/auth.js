import jwt from 'jsonwebtoken';
import User from './models/User';
import dbConnect from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'lichtor-secret-key-2024';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

export async function getAuthUser(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        await dbConnect();
        const user = await User.findById(decoded.id).select('-password');
        return user;
    } catch {
        return null;
    }
}

export async function requireAuth(request) {
    const user = await getAuthUser(request);
    if (!user) {
        return new Response(JSON.stringify({ message: 'Not authorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return user;
}
