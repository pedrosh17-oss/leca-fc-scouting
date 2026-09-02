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

async function fetchAllRecords(table: string, headers: any) {
  let allRecords: any[] = [];
  let offset: string | undefined = undefined;
  do {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${table}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;
  } while (offset);
  return allRecords;
}

export async function GET() {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });
  }

  try {
    const headers = { Authorization: `Bearer ${TOKEN}` };

    const [recsTeams, recsComps] = await Promise.all([
      fetchAllRecords('Teams', headers),
      fetchAllRecords('Competition', headers),
    ]);

    // Mapear IDs de competição para o nome real no Airtable
    const compMap: Record<string, string> = {};
    recsComps.forEach((r: any) => {
      const f = r.fields || {};
      const compName = f['Competition Name'] || f['Name'] || f['Competition'] || f['Liga'];
      if (r.id && compName) {
        compMap[r.id] = String(compName).trim();
      }
    });

    const teams = recsTeams.map((r: any) => {
      const f = r.fields || {};

      // Mapeamento dinâmico da competição
      let competition = 'N/D';
      const rawComp = f['Competition'] || f['Competition Name'] || f['Liga'] || f['League'] || f['Competição'];

      if (Array.isArray(rawComp)) {
        const resolved = rawComp
          .map((id: string) => compMap[id] || id)
          .filter((val: string) => typeof val === 'string' && !val.startsWith('rec'));
        if (resolved.length > 0) competition = resolved.join(', ');
      } else if (rawComp) {
        competition = compMap[rawComp] || safeText(rawComp, 'N/D');
      }

      const logoUrl = Array.isArray(f['Logo']) && f['Logo'][0]?.url 
        ? f['Logo'][0].url 
        : Array.isArray(f['Emblema']) && f['Emblema'][0]?.url 
        ? f['Emblema'][0].url 
        : null;

      const teamName = f['Team Name'] || f['Name'] || f['Equipa'] || f['Clube'] || 'Equipa sem Nome';
      const country = safeText(f['Country'] || f['País'], 'Portugal');
      const status = safeText(f['Status'] || f['Estatuto'], 'Unobserved');
      const totalWatchedMatches = typeof f['Total Watched Matches'] === 'number' 
        ? f['Total Watched Matches'] 
        : (f['Watched Matches'] || 0);

      return {
        id: r.id,
        name: String(teamName).trim(),
        competition,
        country,
        logo: logoUrl,
        status,
        totalWatchedMatches,
      };
    });

    teams.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ total: teams.length, teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}