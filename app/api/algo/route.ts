import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'algo-data.json' });
    if (blobs.length === 0) {
      return NextResponse.json({ algoData: {} });
    }

    const latestBlob = blobs[0];
    const response = await fetch(latestBlob.url, { cache: 'no-store' });
    const algoData = await response.json();

    return NextResponse.json({ algoData });
  } catch (error) {
    return NextResponse.json({ algoData: {} });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonString = JSON.stringify(body);

    await put('algo-data.json', jsonString, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, count: Object.keys(body).length });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao guardar na nuvem da Vercel' }, { status: 500 });
  }
}