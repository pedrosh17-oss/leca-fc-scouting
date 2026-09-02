import { NextResponse } from 'next/server';

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
    return NextResponse.json(
      { error: 'Faltam credenciais no .env.local' },
      { status: 500 }
    );
  }

  try {
    let allRecords: any[] = [];
    let offset: string | undefined = undefined;
    
    // Deteta se estamos no StackBlitz (dev) ou Vercel (produção)
    const isDev = process.env.NODE_ENV === 'development';

    // Loop que varre as páginas do Airtable
    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/Players?pageSize=100${
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
      
      // SE ESTIVERMOS NO STACKBLITZ, PÁRA O LOOP NA PRIMEIRA PÁGINA (100 ATLETAS REAIS)
      if (isDev) {
        break; 
      }

    } while (offset);

    const players = allRecords.map((r: any) => {
      const f = r.fields || {};
      const photoUrl =
        Array.isArray(f['Photo']) && f['Photo'][0]?.url
          ? f['Photo'][0].url
          : null;

      return {
        id: r.id,
        name: safeText(f['Player Name'], 'Sem Nome'),
        photo: photoUrl,
        position: safeText(f['Position'], 'N/D'),
        nationality: safeText(f['Nationality'], 'N/A'),
        age: safeText(f['Age'], 'N/D'),
        club: safeText(f['Current Team'], 'Sem Clube'),
        status: safeText(f['Status'], '⚪ No Activity'),
        report: safeText(
          f['Report '] || f['Final Report'],
          'Sem observações registadas.'
        ),
      };
    });

    return NextResponse.json({ total: players.length, players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}