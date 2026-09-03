import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const runtime = 'nodejs';

// Retorna o URL do Excel na Cloud para o telemóvel descarregar
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'algo-data.xlsx' });
    if (!blobs || blobs.length === 0) return NextResponse.json({ url: null });
    return NextResponse.json({ url: blobs[0].url });
  } catch (error) {
    return NextResponse.json({ url: null });
  }
}

// Entrega o token de escrita ao browser
export async function POST() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: 'Token ausente na Vercel' }, { status: 500 });
  return NextResponse.json({ token });
}