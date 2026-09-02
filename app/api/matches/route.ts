import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

function safeText(val: any, fallback: string = 'N/D'): string {
  if (!val) return fallback;
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object' && val.name) return val.name;
  return String(val);
}

export async function GET() {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });
  }

  try {
    let allRecords: any[] = [];
    let offset: string | undefined = undefined;
    const isDev = process.env.NODE_ENV === 'development';

    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/Matches?pageSize=100${
        offset ? `&offset=${offset}` : ''
      }`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset;
      if (isDev) break;
    } while (offset);

    const matches = allRecords.map((r: any) => {
      const f = r.fields || {};

      // Conta quantos jogadores foram falados/destacados neste jogo
      const playersLinked = Array.isArray(f['Players']) 
        ? f['Players'].length 
        : Array.isArray(f['Player Name']) 
        ? f['Player Name'].length 
        : 0;

      return {
        id: r.id,
        matchName: safeText(f['Match'] || f['Game'] || f['Match Name'], 'Jogo sem Título'),
        gameDate: safeText(f['Date'] || f['Game Date'], 'Data N/D'),
        competition: safeText(f['Competition'] || f['Liga'], 'Competição N/D'),
        scout: safeText(f['Scout'] || f['Scout Name'], 'Scout Não Atribuído'),
        highlightsReport: safeText(
          f['Highlights/Report'] || f['Report'] || f['Notes'],
          'Sem destaques registados.'
        ),
        playersCount: playersLinked,
        type: safeText(f['Observation Type'] || f['Type'], 'Live / Stream'),
      };
    });

    return NextResponse.json({ total: matches.length, matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}