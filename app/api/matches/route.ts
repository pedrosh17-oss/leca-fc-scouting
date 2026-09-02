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
    const headers = { Authorization: `Bearer ${TOKEN}` };

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
      const pObj = {
        id: r.id,
        name: f['Player Name'] || 'Sem Nome',
        photo: Array.isArray(f['Photo']) && f['Photo'][0]?.url ? f['Photo'][0].url : null,
        position: f['Position'] || 'N/D',
        club: f['Team name'] || f['Current Team'] || 'Sem Clube',
      };
      if (f['Player Name']) playerByNameMap[f['Player Name'].trim().toLowerCase()] = pObj;
      playerByIdMap[r.id] = pObj;
    });

    const matches = (dataMatches.records || []).map((r: any) => {
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

      const playerList: any[] = [];
      const rawPlayers = f['Players from Highlights'];

      if (Array.isArray(rawPlayers)) {
        rawPlayers.forEach((item: string) => {
          if (playerByIdMap[item]) playerList.push(playerByIdMap[item]);
          else if (typeof item === 'string' && playerByNameMap[item.trim().toLowerCase()]) playerList.push(playerByNameMap[item.trim().toLowerCase()]);
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
        highlightsReport: safeText(f['Highlights Report'] || f['Notes'], 'Sem destaques registados.'),
        highlightedPlayers: playerList,
        playersCount: playerList.length,
      };
    });

    return NextResponse.json({ total: matches.length, matches, competitions: competitionsList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 1. CRIAR JOGO (PRÉ-JOGO)
export async function POST(req: Request) {
  if (!BASE_ID || !TOKEN) return NextResponse.json({ error: 'Faltam credenciais' }, { status: 500 });

  try {
    const body = await req.json();

    const fields: Record<string, any> = {
      'Match': body.matchTitle,
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
      console.error("Airtable POST Error:", resData);
      return NextResponse.json({ error: resData.error?.message || 'Erro ao criar registo no Airtable' }, { status: 422 });
    }

    return NextResponse.json({ success: true, record: resData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PREENCHER RELATÓRIO DO JOGO & HIGHLIGHTS (PÓS-JOGO)
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

    if (Array.isArray(body.highlights) && body.highlights.length > 0) {
      for (const h of body.highlights) {
        if (!h.notes) continue;

        const highlightFields: Record<string, any> = {
          'Match': [body.matchId],
          'Escreve aqui': h.notes,
        };

        if (h.playerId) {
          highlightFields['Player'] = [h.playerId];
        }

        await fetch(`https://api.airtable.com/v0/${BASE_ID}/Highlights`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: highlightFields }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}