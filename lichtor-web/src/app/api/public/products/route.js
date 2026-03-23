import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    let query = { isActive: true };
    if (category) query.category = category;
    
    let matchedCategories = [];
    
    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ];
        
        // Also search for matching categories
        matchedCategories = await Category.find({
            isActive: true,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { slug: { $regex: q, $options: 'i' } }
            ]
        }).select('name slug').lean();
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });
    
    return NextResponse.json({ 
        products, 
        categories: matchedCategories,
        total: products.length + matchedCategories.length 
    });
}
