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
      const url = `https://api.airtable.com/v0/${BASE_ID}/Players?pageSize=100${offset ? `&offset=${offset}` : ''}`;
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

    const players = allRecords.map((r: any) => {
      const f = r.fields || {};
      const photoUrl = Array.isArray(f['Photo']) && f['Photo'][0]?.url ? f['Photo'][0].url : null;

      // Conta o número de vezes que foi falado (baseado nos links para jogos ou highlights)
      const mentionsCount = Array.isArray(f['Matches']) ? f['Matches'].length : (Array.isArray(f['Highlights']) ? f['Highlights'].length : 0);

      return {
        id: r.id,
        name: safeText(f['Player Name'], 'Sem Nome'),
        photo: photoUrl,
        position: safeText(f['Position'], 'N/D'),
        nationality: safeText(f['Nationality'], 'N/A'),
        age: safeText(f['Age'], 'N/D'),
        height: safeText(f['Height'] || f['Altura'], 'N/D'), // Preparado para quando criares a coluna
        foot: safeText(f['Preferred Foot'] || f['Pé'], 'N/D'), // Preparado para quando criares a coluna
        club: safeText(f['Team name'] || f['Current Team'], 'Sem Clube'), // Puxa do teu novo Lookup!
        status: safeText(f['Status'], '⚪ No Activity'),
        report: safeText(f['Report '] || f['Final Report'], 'Sem observações registadas.'),
        mentions: mentionsCount,
      };
    });

    return NextResponse.json({ total: players.length, players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}