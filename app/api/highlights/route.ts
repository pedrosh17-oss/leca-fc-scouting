import { NextResponse } from 'next/server';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

export async function POST(req: Request) {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json(
      { error: 'Credenciais ausentes' },
      { status: 500 }
    );
  }

  try {
    const { playerId, textNote } = await req.json();

    const fields: Record<string, any> = {
      'Escreve aqui': textNote,
    };

    if (playerId) {
      fields['Player'] = [playerId]; // Associa o registo ao jogador na tabela Players
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Highlights`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro Airtable (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, record: data.records[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
