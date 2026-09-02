import { NextResponse } from 'next/server';

const BASE_ID = (process.env.AIRTABLE_BASE_ID || 'appxQowbIclSmyuol').trim();
const TOKEN = (
  process.env.AIRTABLE_PAT ||
  'patqtC0tvfQAgwxNc.77aafcd9ed5ae095f13fa5eb4535fbc437792ed541079158a0b5b2afacd38dd'
).trim();

function safeNum(val: any): number {
  const p = parseInt(val, 10);
  return isNaN(p) ? 0 : p;
}

export async function GET() {
  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Scouts`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Falha ao carregar Scouts');

    const data = await res.json();
    const scouts = (data.records || []).map((r: any) => {
      const f = r.fields || {};
      return {
        id: r.id,
        name: f['Scout Name'] || 'Observador Leça FC',
        liveMatches: safeNum(f['Live Matches']),
        streamMatches: safeNum(f['Stream Matches']),
        totalMatches: safeNum(f['Total Matches']),
        competitions: f['Competition Rollup (from Matches)'] || 'Várias',
      };
    });

    return NextResponse.json({ scouts });
  } catch (err) {
    return NextResponse.json({ scouts: [] });
  }
}
