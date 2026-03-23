import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    let query = {};
    if (category) query.category = category;
    if (isActive !== null && isActive !== undefined) query.isActive = isActive === 'true';

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });
    return NextResponse.json({ products, total: products.length });
}

export async function POST(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    try {
        const body = await request.json();
        const { name, category, description, features, applications, watt, cct, lumen, specifications, images, datasheet, isActive } = body;

        const product = await Product.create({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            category,
            description: description || '',
            features: features || [],
            applications: applications || [],
            watt: watt || '',
            cct: cct || '',
            lumen: lumen || '',
            specifications: specifications || {},
            images: images || [],
            datasheet: datasheet || '',
            isActive: isActive !== undefined ? isActive : true,
        });

        const populated = await Product.findById(product._id).populate('category');
        return NextResponse.json(populated, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Product with this name already exists' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
