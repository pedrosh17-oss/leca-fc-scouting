import { NextResponse } from 'next/server';

// Memória central partilhada na app
let algoDataStore: Record<string, any> = {};

export async function GET() {
  return NextResponse.json({ algoData: algoDataStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    algoDataStore = body;
    return NextResponse.json({ success: true, count: Object.keys(body).length });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao guardar dados no servidor' }, { status: 500 });
  }
}