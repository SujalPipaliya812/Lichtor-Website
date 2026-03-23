import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    try {
        const body = await request.json();
        const category = await Category.findById(id);
        if (!category) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        if (body.name) {
            category.name = body.name;
            category.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (body.description !== undefined) category.description = body.description;
        if (body.isActive !== undefined) category.isActive = body.isActive;
        if (body.order !== undefined) category.order = body.order;
        if (body.bannerImage !== undefined) category.bannerImage = body.bannerImage;

        await category.save();
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}

export async function PATCH(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    category.isActive = !category.isActive;
    await category.save();
    return NextResponse.json(category);
}
