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

export async function GET() {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    let allRecords: any[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/Players?pageSize=100${offset ? `&offset=${offset}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    const players = allRecords.map((r: any) => {
      const f = r.fields || {};
      const photoUrl = Array.isArray(f['Photo']) && f['Photo'][0]?.url ? f['Photo'][0].url : null;
      const clubLogoUrl = Array.isArray(f['Club Logo']) && f['Club Logo'][0]?.url ? f['Club Logo'][0].url : null;

      return {
        id: r.id,
        name: safeText(f['Player Name'], 'Sem Nome'),
        photo: photoUrl,
        position: safeText(f['Position'], 'N/D'),
        nationality: safeText(f['Nationality'], 'N/A'),
        age: safeText(f['Age'], 'N/D'),
        height: safeText(f[' Height'] || f['Height'], 'N/D'),
        foot: safeText(f['Foot'], 'N/D'),
        club: safeText(f['Team name'] || f['Current Team'], 'Sem Clube'),
        clubLogo: clubLogoUrl,
        status: safeText(f['Status'], '⚪ No Activity'),
        report: safeText(f['Report '] || f['Final Report'], 'Sem observações registadas.'),
      };
    });

    return NextResponse.json({ total: players.length, players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// CRIAR NOVO JOGADOR NA TABELA PLAYERS
export async function POST(req: Request) {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const body = await req.json();

    const fields: Record<string, any> = {
      'Player Name': body.name,
      'Position': body.position || 'N/D',
      'Status': '🟡 Monitoring',
    };

    if (body.club) fields['Current Team'] = body.club;

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Players`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(`Erro Airtable Players: ${JSON.stringify(errData)}`);
    }

    const createdRecord = await res.json();
    return NextResponse.json({ success: true, player: { id: createdRecord.id, name: body.name } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}