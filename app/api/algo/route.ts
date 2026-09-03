import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'algo-data.xlsx' });
    if (!blobs || blobs.length === 0) {
      return NextResponse.json({ url: null });
    }
    return NextResponse.json({ url: blobs[0].url });
  } catch (error) {
    return NextResponse.json({ url: null });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Ficheiro em falta' }, { status: 400 });
    }

    const blob = await put('algo-data.xlsx', file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no Blob' }, { status: 500 });
  }
}