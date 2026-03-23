import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ enquiries, total: enquiries.length });
}
