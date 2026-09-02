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
    if (name) results.push({ name, text });
  }
  return results;
}

function parseDateToTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day).getTime();
    }
  }
  const d = new Date(dateStr).getTime();
  return isNaN(d) ? 0 : d;
}

export async function GET() {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const headers = { Authorization: `Bearer ${TOKEN}` };

    const [resMatches, resComps, resScouts, resPlayers, resHighlights] = await Promise.all([
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Matches?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Competition?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Scouts?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Players?pageSize=100`, { headers, cache: 'no-store' }),
      fetch(`https://api.airtable.com/v0/${BASE_ID}/Highlights?pageSize=100`, { headers, cache: 'no-store' }).catch(() => null)
    ]);

    const dataMatches = await resMatches.json();
    const dataComps = await resComps.json();
    const dataScouts = await resScouts.json();
    const dataPlayers = await resPlayers.json();
    const dataHighlights = resHighlights ? await resHighlights.json() : { records: [] };

    const compMap: Record<string, string> = {};
    const competitionsList: Array<{ id: string; name: string }> = [];
    (dataComps.records || []).forEach((r: any) => {
      if (r.id && r.fields['Competition Name']) {
        compMap[r.id] = r.fields['Competition Name'];
        competitionsList.push({ id: r.id, name: r.fields['Competition Name'] });
      }
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
        name: f['Player Name'] ? f['Player Name'].trim() : 'Sem Nome',
        photo: photoUrl,
        position: f['Position'] || 'N/D',
        club: f['Team name'] || f['Current Team'] || 'Sem Clube',
        clubLogo: clubLogoUrl,
      };

      if (f['Player Name']) playerByNameMap[f['Player Name'].trim().toLowerCase()] = pObj;
      playerByIdMap[r.id] = pObj;
    });

    // Mapeamento direto de registos na tabela Highlights
    const highlightsByMatch: Record<string, any[]> = {};
    (dataHighlights.records || []).forEach((hRec: any) => {
      const hf = hRec.fields || {};
      const matchIds = Array.isArray(hf['Match']) ? hf['Match'] : [];
      const playerIds = Array.isArray(hf['Player']) ? hf['Player'] : [];
      const noteText = hf['Escreve aqui'] || '';

      matchIds.forEach((mId: string) => {
        if (!highlightsByMatch[mId]) highlightsByMatch[mId] = [];
        highlightsByMatch[mId].push({
          highlightId: hRec.id,
          playerId: playerIds[0] || null,
          playerName: hf['New Player'] || null,
          note: noteText
        });
      });
    });

    let matches = (dataMatches.records || []).map((r: any) => {
      const f = r.fields || {};

      let compName = 'Competição N/D';
      if (Array.isArray(f['Competition'])) {
        const resolved = f['Competition'].map((id: string) => compMap[id] || id).filter((val: string) => !val.startsWith('rec'));
        if (resolved.length > 0) compName = resolved.join(', ');
      } else if (f['Competition']) {
        compName = compMap[f['Competition']] || safeText(f['Competition'], 'Competição N/D');
      }

      let scoutNames = 'Scout Não Atribuído';
      if (Array.isArray(f['Scouts'])) {
        const resolved = f['Scouts'].map((id: string) => scoutMap[id] || id).filter((val: string) => !val.startsWith('rec'));
        if (resolved.length > 0) scoutNames = resolved.join(', ');
      } else if (f['Scouts']) {
        scoutNames = scoutMap[f['Scouts']] || safeText(f['Scouts'], 'Scout Não Atribuído');
      }

      const highlightsText = f['Highlights Report'] || f['Notes'] || '';
      const parsedHighlights = parseHighlightsReport(highlightsText);

      const playerList: any[] = [];
      const rawPlayers = f['Players from Highlights'];
      const matchDirectHighlights = highlightsByMatch[r.id] || [];

      if (Array.isArray(rawPlayers)) {
        rawPlayers.forEach((item: string) => {
          let pObj = playerByIdMap[item] || (typeof item === 'string' ? playerByNameMap[item.trim().toLowerCase()] : null);
          if (!pObj && typeof item === 'string' && !item.startsWith('rec')) {
            pObj = { id: item, name: item, position: 'N/D', club: 'N/D' };
          }
          if (pObj) {
            const directH = matchDirectHighlights.find(dh => dh.playerId === pObj.id || (dh.playerName && dh.playerName.toLowerCase() === pObj.name.toLowerCase()));
            const foundNote = parsedHighlights.find(ph => ph.name.toLowerCase() === pObj.name.toLowerCase());
            playerList.push({ 
              ...pObj, 
              note: directH ? directH.note : (foundNote ? foundNote.text : 'Sem notas registadas.'),
              highlightId: directH ? directH.highlightId : null
            });
          }
        });
      } else if (typeof rawPlayers === 'string') {
        rawPlayers.split(',').forEach((nameStr) => {
          const cleanName = nameStr.trim();
          let pObj = playerByNameMap[cleanName.toLowerCase()] || { id: cleanName, name: cleanName, position: 'N/D', club: 'N/D' };
          const directH = matchDirectHighlights.find(dh => dh.playerId === pObj.id || (dh.playerName && dh.playerName.toLowerCase() === cleanName.toLowerCase()));
          const foundNote = parsedHighlights.find(ph => ph.name.toLowerCase() === cleanName.toLowerCase());
          playerList.push({ 
            ...pObj, 
            note: directH ? directH.note : (foundNote ? foundNote.text : 'Sem notas registadas.'),
            highlightId: directH ? directH.highlightId : null
          });
        });
      }

      if (playerList.length === 0 && matchDirectHighlights.length > 0) {
        matchDirectHighlights.forEach((dh) => {
          const pObj = dh.playerId ? playerByIdMap[dh.playerId] : (dh.playerName ? playerByNameMap[dh.playerName.toLowerCase()] : null);
          const finalP = pObj || { id: dh.playerId || dh.playerName, name: dh.playerName || 'Atleta', position: 'N/D', club: 'N/D' };
          playerList.push({
            ...finalP,
            note: dh.note,
            highlightId: dh.highlightId
          });
        });
      }

      return {
        id: r.id,
        matchName: safeText(f['Match'], 'Jogo sem Título'),
        gameDate: safeText(f['Game Date'], 'Data N/D'),
        competition: compName,
        scout: scoutNames,
        type: safeText(f['Type'], 'Live / Stream'),
        homeTactic: safeText(f['Home Team Tactic'], '-'),
        awayTactic: safeText(f['Away Team Tactic'], '-'),
        tempo: safeText(f['Game Tempo'], '-'),
        intensity: safeText(f['Physicall Intensity'], '-'),
        technical: safeText(f['Overall Technical Quality'], '-'),
        pressure: safeText(f['Mental/Fans/Importance Pressure'], '-'),
        notes: safeText(f['Notes'], ''),
        highlightedPlayers: playerList,
        playersCount: playerList.length,
      };
    });

    matches.sort((a: any, b: any) => parseDateToTimestamp(b.gameDate) - parseDateToTimestamp(a.gameDate));

    return NextResponse.json({ total: matches.length, matches, competitions: competitionsList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const body = await req.json();

    const fields: Record<string, any> = {
      'Game Date': body.gameDate,
      'Type': body.type || '🏟️ Live',
    };

    if (body.homeTeamId) fields['Home Team'] = [body.homeTeamId];
    if (body.awayTeamId) fields['Away Team'] = [body.awayTeamId];
    if (body.competitionId) fields['Competition'] = [body.competitionId];
    if (body.scoutId) fields['Scouts'] = [body.scoutId];

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Matches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    const resData = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: resData.error?.message || 'Erro ao criar registo no Airtable' }, { status: 422 });
    }

    return NextResponse.json({ success: true, record: resData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ATUALIZAÇÃO APENAS DAS MÉTRICAS COLETIVAS DA PARTIDA
export async function PATCH(req: Request) {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const body = await req.json();

    const matchFields: Record<string, any> = {
      'Home Team Tactic': body.homeTactic || '1-4-3-3',
      'Away Team Tactic': body.awayTactic || '1-4-3-3',
      'Game Tempo': body.tempo || 'Medium',
      'Physicall Intensity': body.intensity || 'Medium',
      'Overall Technical Quality': body.technical || 'Medium',
      'Mental/Fans/Importance Pressure': body.pressure || 'Medium',
      'Notes': body.notes || '',
    };

    const resMatch = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Matches/${body.matchId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: matchFields }),
    });

    const resMatchData = await resMatch.json();

    if (!resMatch.ok) {
      return NextResponse.json({ error: resMatchData.error?.message || 'Erro no Airtable' }, { status: 422 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}