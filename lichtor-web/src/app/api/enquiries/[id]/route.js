import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';
import { requireAuth } from '@/lib/auth';

export async function PATCH(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    try {
        const body = await request.json();
        const enquiry = await Enquiry.findByIdAndUpdate(id, { status: body.status }, { new: true });
        if (!enquiry) return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
        return NextResponse.json(enquiry);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    await dbConnect();
    const { id } = await params;
    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Enquiry deleted' });
}
