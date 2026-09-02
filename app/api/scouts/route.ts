import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_PAT;

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
      const playersHighlighted = Array.isArray(f['Players (Highlights)']) ? f['Players (Highlights)'].length : 0;

      const rawComps = f['Competition Rollup (from Matches)'] || f['Competições'] || '';
      const compsArray = Array.isArray(rawComps) 
        ? rawComps.map(c => String(c))
        : typeof rawComps === 'string' && rawComps 
        ? rawComps.split(',').map(s => s.trim()) 
        : [];

      return {
        id: r.id,
        name: f['Scout Name'] || 'Scout Sem Nome',
        photo: photoUrl,
        liveMatches: f['Live Matches'] || 0,
        streamMatches: f['Stream Matches'] || 0,
        totalMatches: f['Total Matches'] || 0,
        playersCount: playersHighlighted,
        competitions: compsArray.length > 0 ? compsArray : ['Sem mercado atribuído'],
      };
    });

    return NextResponse.json({ total: scouts.length, scouts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}