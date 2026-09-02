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
  const str = String(val);
  return str.startsWith('rec') ? fallback : str;
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
      const url = `https://api.airtable.com/v0/${BASE_ID}/Teams?pageSize=100${
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

    const teams = allRecords.map((r: any) => {
      const f = r.fields || {};
      const logoUrl = Array.isArray(f['Logo']) && f['Logo'][0]?.url ? f['Logo'][0].url : null;

      return {
        id: r.id,
        name: safeText(f['Team Name'], 'Equipa Sem Nome'),
        logo: logoUrl,
        country: safeText(f['Country'], 'Portugal'),
        competition: safeText(f['Competition'], 'N/D'),
        totalWatchedMatches: f['Total watched matches'] ?? 0,
        status: safeText(f['Status'], '⚪ Unobserved'),
      };
    });

    return NextResponse.json({ total: teams.length, teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}