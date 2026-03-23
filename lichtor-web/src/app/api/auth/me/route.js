import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const result = await requireAuth(request);
    if (result instanceof Response) return result;
    return NextResponse.json({ _id: result._id, name: result.name, email: result.email, role: result.role });
}
