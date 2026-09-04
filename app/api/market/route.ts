import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_PAT || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const opportunityId = searchParams.get('opportunityId');
    const includeLogs = searchParams.get('includeLogs') === 'true';

    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades`;
    if (playerId) {
      url += `?filterByFormula=SEARCH('${playerId}', ARRAYJOIN({Jogador}))`;
    }

    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err?.error?.message || err }, { status: res.status });
    }

    const data = await res.json();

    let logs: any[] = [];
    if (includeLogs || opportunityId) {
      let logUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Logs_Mercado`;
      if (opportunityId) {
        logUrl += `?filterByFormula=SEARCH('${opportunityId}', ARRAYJOIN({Oportunidade}))`;
      }
      const logRes = await fetch(logUrl, { headers, cache: 'no-store' });
      if (logRes.ok) {
        const logData = await logRes.json();
        logs = logData.records || [];
      }
    }

    return NextResponse.json({ opportunities: data.records || [], logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      playerId, name, club, position, foot, birthDate, offerDate, 
      marketTarget, scout, status, viability, confLiga3, confLiga2, 
      contract, utilization, strengths, weaknesses, reason, 
      similarity, mental, vetoReason, vetoDate, presidentOpinion, notesDD
    } = body;

    let targetPlayerId = playerId;

    // 1. Se não tiver ID e for um atleta novo, procura ou cria em 'Players'
    if (!targetPlayerId && name) {
      const cleanName = name.trim();
      const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Players?filterByFormula=LOWER({Name})='${encodeURIComponent(cleanName.toLowerCase())}'`;
      
      try {
        const searchRes = await fetch(searchUrl, { headers, cache: 'no-store' });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.records && searchData.records.length > 0) {
            targetPlayerId = searchData.records[0].id;
          }
        }
      } catch (sErr) {
        console.warn("Pesquisa de jogador falhou, avançando para criação:", sErr);
      }

      // Se continuar sem existir na BD, cria o jogador na tabela 'Players'
      if (!targetPlayerId) {
        const createPlayerUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Players`;
        
        const playerFields: Record<string, any> = { Name: cleanName };
        if (club && club.trim()) playerFields.Club = club;
        if (position && position.trim()) playerFields.Position = position;
        if (foot && foot.trim()) playerFields.Foot = foot;
        if (birthDate && birthDate.trim()) playerFields.BirthDate = birthDate;
        playerFields.Status = 'Monitored';

        const createPlayerRes = await fetch(createPlayerUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            records: [{ fields: playerFields }],
            typecast: true
          }),
        });

        if (!createPlayerRes.ok) {
          const errP = await createPlayerRes.json();
          const detail = errP?.error?.message || JSON.stringify(errP);
          console.error("Erro ao criar Player no Airtable:", detail);
          return NextResponse.json({ error: `Falha ao criar Jogador (${detail})` }, { status: 400 });
        }

        const newPlayerData = await createPlayerRes.json();
        targetPlayerId = newPlayerData.records[0]?.id;
      }
    }

    // 2. Criar o registo na tabela 'Mercado_Oportunidades'
    const createMarketUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades`;
    const initialStatus = status || 'Em Avaliação';

    const marketFields: Record<string, any> = {
      'Status Negociação': initialStatus,
    };

    if (marketTarget) marketFields['Mercado Target'] = marketTarget;
    if (scout) marketFields['Scout'] = scout;
    if (viability) marketFields['Viabilidade Financeira'] = viability;
    if (contract) marketFields['Contrato'] = contract;
    if (utilization) marketFields['Utilização'] = utilization;
    if (strengths) marketFields['Pontos Fortes'] = strengths;
    if (weaknesses) marketFields['Pontos Fracos'] = weaknesses;
    if (reason) marketFields['Motivo da Contratação'] = reason;
    if (similarity) marketFields['Semelhança Plantel'] = similarity;
    if (mental) marketFields['Caráter e Mental'] = mental;
    if (vetoReason) marketFields['Motivo do Veto'] = vetoReason;
    if (presidentOpinion) marketFields['Opinião do Presidente'] = presidentOpinion;
    if (notesDD) marketFields['Notas Diretor Desportivo'] = notesDD;

    if (confLiga3 && !isNaN(parseInt(confLiga3))) marketFields['Confiança Liga 3'] = parseInt(confLiga3);
    if (confLiga2 && !isNaN(parseInt(confLiga2))) marketFields['Confiança Liga 2'] = parseInt(confLiga2);

    if (offerDate && offerDate.trim() !== '') marketFields['Data da Oferta'] = offerDate;
    if (vetoDate && vetoDate.trim() !== '') marketFields['Data do Veto'] = vetoDate;
    if (targetPlayerId) marketFields['Jogador'] = [targetPlayerId];

    const marketRes = await fetch(createMarketUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{ fields: marketFields }],
        typecast: true
      }),
    });

    if (!marketRes.ok) {
      const err = await marketRes.json();
      const detail = err?.error?.message || JSON.stringify(err);
      console.error("Erro ao criar Oportunidade no Airtable:", detail);
      return NextResponse.json({ error: `Falha ao criar Oportunidade (${detail})` }, { status: 400 });
    }

    const newMarket = await marketRes.json();
    const createdRecordId = newMarket.records[0]?.id;

    // 3. Registar Log inicial na tabela 'Logs_Mercado'
    try {
      const nowFormatted = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
      const logUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Logs_Mercado`;

      await fetch(logUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Name': `LOG - ${name || 'Atleta'}`,
                'Oportunidade': [createdRecordId],
                'Utilizador': scout || 'Sistema',
                'Status_Anterior': 'Criado',
                'Status_Novo': initialStatus,
                'Data_Hora': nowFormatted,
                'Notas': reason || 'Oportunidade registada no sistema.',
              },
            },
          ],
          typecast: true
        }),
      });
    } catch (logErr) {
      console.error("Erro ao criar Log:", logErr);
    }

    return NextResponse.json({ success: true, record: newMarket.records[0] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      recordId, status, previousStatus, user, vetoReason, vetoDate, 
      presidentOpinion, notesDD, strengths, weaknesses 
    } = body;

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID é obrigatório' }, { status: 400 });
    }

    const updateUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades/${recordId}`;
    const fields: Record<string, any> = {};

    if (status !== undefined) fields['Status Negociação'] = status;
    if (vetoReason !== undefined) fields['Motivo do Veto'] = vetoReason;
    if (presidentOpinion !== undefined) fields['Opinião do Presidente'] = presidentOpinion;
    if (notesDD !== undefined) fields['Notas Diretor Desportivo'] = notesDD;
    if (strengths !== undefined) fields['Pontos Fortes'] = strengths;
    if (weaknesses !== undefined) fields['Pontos Fracos'] = weaknesses;
    if (vetoDate && vetoDate.trim() !== '') fields['Data do Veto'] = vetoDate;

    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields, typecast: true }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err?.error?.message || err }, { status: res.status });
    }

    const updated = await res.json();

    try {
      const nowFormatted = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
      const logUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Logs_Mercado`;
      const logNotes = vetoReason || notesDD || presidentOpinion || 'Alteração de estado efetuada no pipeline.';

      await fetch(logUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Name': `LOG - ${status || 'Atualização'}`,
                'Oportunidade': [recordId],
                'Utilizador': user || 'Utilizador',
                'Status_Anterior': previousStatus || 'N/D',
                'Status_Novo': status || 'N/D',
                'Data_Hora': nowFormatted,
                'Notas': logNotes,
              },
            },
          ],
          typecast: true
        }),
      });
    } catch (logErr) {
      console.error("Erro ao gravar Log:", logErr);
    }

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('recordId');

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID é obrigatório' }, { status: 400 });
    }

    const deleteUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades/${recordId}`;
    const res = await fetch(deleteUrl, { method: 'DELETE', headers });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err?.error?.message || err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, deleted: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}