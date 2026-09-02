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
      const url = `https://api.airtable.com/v0/${BASE_ID}/Matches?pageSize=100${offset ? `&offset=${offset}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset;
      if (process.env.NODE_ENV === 'development') break;
    } while (offset);

    const matches = allRecords.map((r: any) => {
      const f = r.fields || {};
      const highlightedPlayers = f['Players from Highlights'];

      return {
        id: r.id,
        matchName: safeText(f['Match'], 'Jogo sem Título'),
        gameDate: safeText(f['Game Date'], 'Data N/D'),
        // Vai procurar primeiro no Lookup, se não houver usa o campo normal
        competition: safeText(f['Competition Name'] || f['Competition'], 'Competição Desconhecida'),
        scout: safeText(f['Scouts'], 'Scout Não Atribuído'),
        type: safeText(f['Type'], 'Live / Stream'),
        playersCount: Array.isArray(highlightedPlayers) ? highlightedPlayers.length : 0,
        playersList: safeText(highlightedPlayers, 'Nenhum atleta associado'),
        // Novas Variáveis Técnicas
        tempo: safeText(f['Game Tempo'], '-'),
        intensity: safeText(f['Physicall Intensity'], '-'),
        technical: safeText(f['Overall Technical Quality'], '-'),
        pressure: safeText(f['Mental/Fans/Importance Pressure'], '-'),
        notes: safeText(f['Notes'], ''),
        highlightsReport: safeText(f['Highlights Report'] || f['Notes'], 'Sem destaques registados para este jogo.'),
      };
    });

    return NextResponse.json({ total: matches.length, matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}