import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const categories = await Category.find().sort({ order: 1 });
    return NextResponse.json(categories);
}

export async function POST(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    try {
        const body = await request.json();
        const { name, description, isActive, order, bannerImage } = body;

        const category = await Category.create({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0,
            bannerImage: bannerImage || '',
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Category with this name already exists' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
