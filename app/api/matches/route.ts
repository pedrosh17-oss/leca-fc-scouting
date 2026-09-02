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

function parseHighlightsReport(reportText: string) {
  if (!reportText) return [];
  const regex = /👤\s*([^➔\n]+)\s*➔\s*([\s\S]*?)(?=(?:👤|$))/g;
  const results: { name: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(reportText)) !== null) {
    const name = match[1].trim();
    const text = match[2].trim();
    if (name) {
      results.push({ name, text });
    }
  }
  return results;
}

export async function GET() {
  if (!BASE_ID || !TOKEN) {
    return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });
  }

  try {
    const headers = { Authorization: `Bearer ${TOKEN}` };

    // Cruzamento em paralelo no servidor
    const [resMatches, resComps, resScouts, resPlayers] = await Promise.all([
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Matches?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Competition?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Scouts?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Players?pageSize=100`, { headers, cache: 'no-store' })
    ]);

    const dataMatches = await resMatches.json();
    const dataComps = await resComps.json();
    const dataScouts = await resScouts.json();
    const dataPlayers = await resPlayers.json();

    const compMap: Record<string, string> = {};
    (dataComps.records || []).forEach((r: any) => {
      if (r.id && r.fields['Competition Name']) compMap[r.id] = r.fields['Competition Name'];
    });

    const scoutMap: Record<string, string> = {};
    (dataScouts.records || []).forEach((r: any) => {
      if (r.id && r.fields['Scout Name']) scoutMap[r.id] = r.fields['Scout Name'];
    });

    const playerByNameMap: Record<string, any> = {};
    const playerByIdMap: Record<string, any> = {};
    (dataPlayers.records || []).forEach((r: any) => {
      const f = r.fields || {};
      const photoUrl = Array.isArray(f['Photo']) && f['Photo'][0]?.url ? f['Photo'][0].url : null;
      const clubLogoUrl = Array.isArray(f['Club Logo']) && f['Club Logo'][0]?.url ? f['Club Logo'][0].url : null;
      
      const pObj = {
        id: r.id,
        name: f['Player Name'] || 'Sem Nome',
        photo: photoUrl,
        position: f['Position'] || 'N/D',
        club: f['Team name'] || f['Current Team'] || 'Sem Clube',
        clubLogo: clubLogoUrl,
        age: f['Age'] || 'N/D',
        nationality: f['Nationality'] || 'N/A',
        status: f['Status'] || '⚪ No Activity',
        report: f['Report '] || f['Final Report'] || 'Sem observações registadas.',
      };

      if (f['Player Name']) playerByNameMap[f['Player Name'].trim().toLowerCase()] = pObj;
      playerByIdMap[r.id] = pObj;
    });

    const matches = (dataMatches.records || []).map((r: any) => {
      const f = r.fields || {};

      // Resolução da Competição
      let compName = 'Competição N/D';
      if (Array.isArray(f['Competition'])) {
        const resolved = f['Competition'].map((id: string) => compMap[id] || id).filter((val: string) => !val.startsWith('rec'));
        if (resolved.length > 0) compName = resolved.join(', ');
      } else if (f['Competition']) {
        compName = compMap[f['Competition']] || safeText(f['Competition'], 'Competição N/D');
      }

      // Resolução dos Scouts
      let scoutNames = 'Scout Não Atribuído';
      if (Array.isArray(f['Scouts'])) {
        const resolved = f['Scouts'].map((id: string) => scoutMap[id] || id).filter((val: string) => !val.startsWith('rec'));
        if (resolved.length > 0) scoutNames = resolved.join(', ');
      } else if (f['Scouts']) {
        scoutNames = scoutMap[f['Scouts']] || safeText(f['Scouts'], 'Scout Não Atribuído');
      }

      const highlightsText = f['Highlights Report'] || f['Notes'] || '';
      const parsedHighlights = parseHighlightsReport(highlightsText);

      // Associação de objetos completos de Jogadores
      const playerList: any[] = [];
      const rawPlayers = f['Players from Highlights'];

      if (Array.isArray(rawPlayers)) {
        rawPlayers.forEach((item: string) => {
          if (playerByIdMap[item]) playerList.push(playerByIdMap[item]);
          else if (typeof item === 'string' && playerByNameMap[item.trim().toLowerCase()]) playerList.push(playerByNameMap[item.trim().toLowerCase()]);
          else if (typeof item === 'string' && !item.startsWith('rec')) playerList.push({ id: item, name: item, position: 'N/D', club: 'N/D' });
        });
      } else if (typeof rawPlayers === 'string') {
        rawPlayers.split(',').forEach((nameStr) => {
          const cleanName = nameStr.trim();
          if (playerByNameMap[cleanName.toLowerCase()]) playerList.push(playerByNameMap[cleanName.toLowerCase()]);
          else if (cleanName) playerList.push({ id: cleanName, name: cleanName, position: 'N/D', club: 'N/D' });
        });
      }

      if (playerList.length === 0 && parsedHighlights.length > 0) {
        parsedHighlights.forEach((ph) => {
          const matchP = playerByNameMap[ph.name.toLowerCase()];
          if (matchP) playerList.push(matchP);
          else playerList.push({ id: ph.name, name: ph.name, position: 'N/D', club: 'N/D' });
        });
      }

      return {
        id: r.id,
        matchName: safeText(f['Match'], 'Jogo sem Título'),
        gameDate: safeText(f['Game Date'], 'Data N/D'),
        competition: compName,
        scout: scoutNames,
        type: safeText(f['Type'], 'Live / Stream'),
        tempo: safeText(f['Game Tempo'], '-'),
        intensity: safeText(f['Physicall Intensity'], '-'),
        technical: safeText(f['Overall Technical Quality'], '-'),
        pressure: safeText(f['Mental/Fans/Importance Pressure'], '-'),
        notes: safeText(f['Notes'], ''),
        highlightsReport: highlightsText,
        parsedHighlights: parsedHighlights,
        highlightedPlayers: playerList,
        playersCount: playerList.length,
      };
    });

    return NextResponse.json({ total: matches.length, matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}