import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = { isActive: true };
    if (category) query.category = category;

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });
    return NextResponse.json({ products, total: products.length });
}
