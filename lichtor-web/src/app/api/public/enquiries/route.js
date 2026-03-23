import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { name, phone, email, enquiryType, message } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ message: 'Name, phone and email are required' }, { status: 400 });
        }

        const enquiry = await Enquiry.create({ name, phone, email, enquiryType, message });
        return NextResponse.json({ message: 'Enquiry submitted successfully', enquiry }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
