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
    const headers = { Authorization: `Bearer ${TOKEN}` };

    // Tradução paralela das chaves de competição
    const [resTeams, resComps] = await Promise.all([
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Teams?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Competition?pageSize=100`, { headers, cache: 'no-store' })
    ]);

    const dataTeams = await resTeams.json();
    const dataComps = await resComps.json();

    const compMap: Record<string, string> = {};
    (dataComps.records || []).forEach((r: any) => {
      if (r.id && r.fields['Competition Name']) compMap[r.id] = r.fields['Competition Name'];
    });

    const teams = (dataTeams.records || []).map((r: any) => {
      const f = r.fields || {};
      const logoUrl = Array.isArray(f['Logo']) && f['Logo'][0]?.url ? f['Logo'][0].url : null;

      let compName = 'Competição N/D';
      if (Array.isArray(f['Competition'])) {
        const resolved = f['Competition'].map((id: string) => compMap[id] || id).filter((val: string) => !val.startsWith('rec'));
        if (resolved.length > 0) compName = resolved.join(', ');
      } else if (f['Competition']) {
        compName = compMap[f['Competition']] || safeText(f['Competition'], 'Competição N/D');
      }

      return {
        id: r.id,
        name: safeText(f['Team Name'], 'Equipa Sem Nome'),
        logo: logoUrl,
        country: safeText(f['Country'], 'Portugal'),
        competition: compName,
        totalWatchedMatches: f['Total watched matches'] ?? 0,
        status: safeText(f['Status'], '⚪ Unobserved'),
      };
    });

    return NextResponse.json({ total: teams.length, teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}