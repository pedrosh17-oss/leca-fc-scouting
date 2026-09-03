import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'algo-data.xlsx' });
    if (blobs.length === 0) {
      return NextResponse.json({ url: null });
    }
    // Devolve o link do ficheiro Excel guardado na nuvem da Vercel
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
      return NextResponse.json({ error: 'Nenhum ficheiro recebido' }, { status: 400 });
    }

    // Guarda o ficheiro .xlsx diretamente no Vercel Blob (ocupando apenas ~1.5 MB)
    const blob = await put('algo-data.xlsx', file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Erro no upload Vercel Blob:', error);
    return NextResponse.json({ error: 'Erro ao guardar na nuvem da Vercel' }, { status: 500 });
  }
}