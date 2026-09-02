import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

export async function POST(req: Request) {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const body = await req.json();
    const { matchId, playerId, highlightId, notes } = body;

    if (!matchId || !notes) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    // 1. Atualizar Highlight existente por ID
    if (highlightId && !highlightId.startsWith('temp-')) {
      const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Highlights/${highlightId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          fields: {
            'Escreve aqui': notes,
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: resData.error?.message || 'Erro ao atualizar highlight' }, { status: 422 });
      }

      return NextResponse.json({ success: true, record: resData });
    }

    // 2. Pesquisar se já existe highlight para este Match + Player
    if (playerId) {
      const filterFormula = `AND(RECORD_ID() != '', FIND('${matchId}', {Match}), FIND('${playerId}', {Player}))`;
      const searchUrl = `https://api.airtable.com/v0/${BASE_ID}/Highlights?filterByFormula=${encodeURIComponent(filterFormula)}`;
      const searchRes = await fetch(searchUrl, { headers, cache: 'no-store' });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.records && searchData.records.length > 0) {
          const existingRec = searchData.records[0];
          const patchRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Highlights/${existingRec.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              fields: {
                'Escreve aqui': notes,
              },
            }),
          });
          const patchData = await patchRes.json();
          if (patchRes.ok) {
            return NextResponse.json({ success: true, record: patchData });
          }
        }
      }
    }

    // 3. Criar novo registo na tabela Highlights
    const createFields: Record<string, any> = {
      'Match': [matchId],
      'Escreve aqui': notes,
    };

    if (playerId) {
      createFields['Player'] = [playerId];
    }

    const createRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Highlights`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields: createFields }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      return NextResponse.json({ error: createData.error?.message || 'Erro ao criar highlight' }, { status: 422 });
    }

    return NextResponse.json({ success: true, record: createData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}