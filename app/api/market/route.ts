import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_PAT || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

// GET: Procurar oportunidades de mercado e histórico de logs
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
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    // Se forem solicitados os logs da tabela Logs_Mercado
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

// POST: Criar nova Oportunidade de Mercado e registar Log inicial
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      playerId,
      name,
      club,
      position,
      foot,
      birthDate,
      offerDate,
      marketTarget,
      scout,
      status,
      viability,
      confLiga3,
      confLiga2,
      contract,
      utilization,
      strengths,
      weaknesses,
      reason,
      similarity,
      mental,
      vetoReason,
      vetoDate,
      presidentOpinion,
      notesDD
    } = body;

    let targetPlayerId = playerId;

    // 1. Se o jogador não tiver ID, verifica se já existe em 'Players' pelo nome
    if (!targetPlayerId && name) {
      const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Players?filterByFormula=LOWER({Name})='${encodeURIComponent(name.toLowerCase().trim())}'`;
      const searchRes = await fetch(searchUrl, { headers, cache: 'no-store' });
      
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.records && searchData.records.length > 0) {
          targetPlayerId = searchData.records[0].id;
        }
      }

      // Se continuar sem existir, cria primeiro a ficha do atleta em 'Players'
      if (!targetPlayerId) {
        const createPlayerUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Players`;
        const createPlayerRes = await fetch(createPlayerUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            records: [
              {
                fields: {
                  Name: name,
                  Club: club || '',
                  Position: position || '',
                  Foot: foot || '',
                  BirthDate: birthDate || '',
                  Status: 'Monitored',
                },
              },
            ],
            typecast: true
          }),
        });

        if (!createPlayerRes.ok) {
            const errP = await createPlayerRes.json();
            console.error("Erro ao criar Player:", errP);
            return NextResponse.json({ error: errP }, { status: createPlayerRes.status });
        }

        const newPlayerData = await createPlayerRes.json();
        targetPlayerId = newPlayerData.records[0].id;
      }
    }

    // 2. Criar o registo na tabela 'Mercado_Oportunidades'
    const createMarketUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades`;
    const initialStatus = status || 'Em Avaliação';

    const marketFields: Record<string, any> = {
      'Mercado Target': marketTarget || '',
      'Scout': scout || '',
      'Status Negociação': initialStatus,
      'Viabilidade Financeira': viability || '',
      'Confiança Liga 3': confLiga3 || '',
      'Confiança Liga 2': confLiga2 || '',
      'Contrato': contract || '',
      'Utilização': utilization || '',
      'Pontos Fortes': strengths || '',
      'Pontos Fracos': weaknesses || '',
      'Motivo da Contratação': reason || '',
      'Semelhança Plantel': similarity || '',
      'Caráter e Mental': mental || '',
      'Motivo do Veto': vetoReason || '',
      'Opinião do Presidente': presidentOpinion || '',
      'Notas Diretor Desportivo': notesDD || '',
    };

    if (offerDate) marketFields['Data da Oferta'] = offerDate;
    if (vetoDate) marketFields['Data do Veto'] = vetoDate;
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
      console.error("Erro ao criar Oportunidade de Mercado:", err);
      return NextResponse.json({ error: err }, { status: marketRes.status });
    }

    const newMarket = await marketRes.json();
    const createdRecordId = newMarket.records[0].id;

    // 3. Registar o Log inicial na tabela 'Logs_Mercado'
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
                'Notas': reason || 'Oportunidade de mercado submetida no sistema.',
              },
            },
          ],
          typecast: true
        }),
      });
    } catch (logErr) {
      console.error("Erro ao criar Log de registo:", logErr);
    }

    return NextResponse.json({ success: true, record: newMarket.records[0] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Atualizar Estado, Vetos e Registar Auditoria na tabela 'Logs_Mercado'
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      recordId, 
      status, 
      previousStatus, 
      user, 
      vetoReason, 
      vetoDate, 
      presidentOpinion, 
      notesDD 
    } = body;

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID é obrigatório' }, { status: 400 });
    }

    // 1. Atualizar a Oportunidade na tabela 'Mercado_Oportunidades'
    const updateUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Mercado_Oportunidades/${recordId}`;
    const fields: Record<string, any> = {};

    if (status !== undefined) fields['Status Negociação'] = status;
    if (vetoReason !== undefined) fields['Motivo do Veto'] = vetoReason;
    if (vetoDate !== undefined) fields['Data do Veto'] = vetoDate;
    if (presidentOpinion !== undefined) fields['Opinião do Presidente'] = presidentOpinion;
    if (notesDD !== undefined) fields['Notas Diretor Desportivo'] = notesDD;

    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields, typecast: true }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const updated = await res.json();

    // 2. Gravar entrada de Auditoria na tabela 'Logs_Mercado'
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
      console.error("Erro ao gravar Log de auditoria:", logErr);
    }

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}