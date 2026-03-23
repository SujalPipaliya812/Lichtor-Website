import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    try {
        const body = await request.json();
        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        const fields = ['name', 'description', 'category', 'watt', 'cct', 'lumen', 'datasheet', 'isActive'];
        fields.forEach(f => { if (body[f] !== undefined) product[f] = body[f]; });

        if (body.features) product.features = body.features;
        if (body.applications) product.applications = body.applications;
        if (body.images) product.images = body.images;
        if (body.specifications) product.specifications = { ...product.specifications.toObject?.() || {}, ...body.specifications };
        if (body.name) product.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        await product.save();
        const populated = await Product.findById(product._id).populate('category');
        return NextResponse.json(populated);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}

export async function PATCH(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    product.isActive = !product.isActive;
    await product.save();
    const populated = await Product.findById(product._id).populate('category');
    return NextResponse.json(populated);
}
