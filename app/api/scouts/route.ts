import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

function countUniquePlayers(val: any): number {
  if (!val) return 0;
  if (Array.isArray(val)) {
    const allNames = new Set<string>();
    val.forEach((item) => {
      if (typeof item === 'string') {
        item.split(',').forEach((n) => {
          const clean = n.trim();
          if (clean) allNames.add(clean.toLowerCase());
        });
      }
    });
    return allNames.size;
  }
  if (typeof val === 'string') {
    const names = val.split(',').map((n) => n.trim()).filter(Boolean);
    return new Set(names.map((n) => n.toLowerCase())).size;
  }
  return 0;
}

export async function GET() {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/Scouts`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    const scouts = (data.records || []).map((r: any) => {
      const f = r.fields || {};
      const photoUrl = Array.isArray(f['Profile Photo']) && f['Profile Photo'][0]?.url ? f['Profile Photo'][0].url : null;
      
      // Extrai e conta os nomes reais e únicos de cada jogador analisado
      const reportedCount = countUniquePlayers(f['Players (Highlights)']);

      return {
        id: r.id,
        name: f['Scout Name'] || 'Scout Sem Nome',
        photo: photoUrl,
        liveMatches: f['Live Matches'] || 0,
        streamMatches: f['Stream Matches'] || 0,
        totalMatches: f['Total Matches'] || 0,
        playersCount: reportedCount,
        // Mantém neutro até definirmos a atribuição via login de Admin
        competitions: ['Pendente de Atribuição (Admin)'],
      };
    });

    return NextResponse.json({ total: scouts.length, scouts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}