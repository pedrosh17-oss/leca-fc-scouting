import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

function safeText(val: any, fallback: string = 'N/D'): string {
  if (!val) return fallback;
  if (Array.isArray(val)) {
    const clean = val.filter((item) => typeof item === 'string' && !item.startsWith('rec'));
    return clean.length > 0 ? clean.join(', ') : fallback;
  }
  if (typeof val === 'object' && val.name) return val.name;
  const str = String(val);
  return str.startsWith('rec') ? fallback : str;
}

function formatFoot(val: any): string {
  if (!val) return 'N/D';
  const str = String(val).trim();
  if (str === 'D') return 'Direito (D)';
  if (str === 'E') return 'Esquerdo (E)';
  if (str === 'A') return 'Ambidestro';
  return str;
}

export async function GET() {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });
  }

  try {
    let allRecords: any[] = [];
    let offset: string | undefined = undefined;

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
    } while (offset);

    const players = allRecords.map((r: any) => {
      const f = r.fields || {};
      const photoUrl = Array.isArray(f['Photo']) && f['Photo'][0]?.url ? f['Photo'][0].url : null;
      
      const clubLogoUrl = Array.isArray(f['Club Logo']) && f['Club Logo'][0]?.url 
        ? f['Club Logo'][0].url 
        : Array.isArray(f['Team Logo']) && f['Team Logo'][0]?.url 
        ? f['Team Logo'][0].url 
        : null;

      const rawClub = f['Team name'] || f['Current Team'];
      let clubName = safeText(rawClub, 'Sem Clube');

      const rawHeight = f[' Height'] || f['Height'] || f['Altura'];
      const rawFoot = f['Foot'] || f['Preferred Foot'] || f['Pé'] || f['Pé Preferencial'];

      const mentionsCount = Array.isArray(f['Matches']) 
        ? f['Matches'].length 
        : (Array.isArray(f['Highlights']) ? f['Highlights'].length : 0);

      return {
        id: r.id,
        name: safeText(f['Player Name'], 'Sem Nome'),
        photo: photoUrl,
        position: safeText(f['Position'], 'N/D'),
        nationality: safeText(f['Nationality'], 'N/A'),
        age: safeText(f['Age'], 'N/D'),
        height: safeText(rawHeight, 'N/D'),
        foot: formatFoot(rawFoot),
        club: clubName,
        clubLogo: clubLogoUrl,
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