import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    const user = await requireAuth(request);
    if (user instanceof Response) return user;

    try {
        const formData = await request.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const urls = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${timestamp}-${safeName}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            urls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls, url: urls[0] });
    } catch (error) {
        return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
    }
}
