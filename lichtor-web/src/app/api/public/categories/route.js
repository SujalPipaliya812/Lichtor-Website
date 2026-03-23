import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';

export async function GET() {
    await dbConnect();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ categories, total: categories.length });
}
