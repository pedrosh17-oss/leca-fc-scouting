import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

// GET: Procurar oportunidades de mercado (todas ou de um jogador específico)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

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
    return NextResponse.json({ opportunities: data.records || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Criar nova Oportunidade de Mercado
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
            typecast: true // Força o Airtable a aceitar os dados
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
    const marketFields: Record<string, any> = {
      'Mercado Target': marketTarget || '',
      'Scout': scout || '',
      'Status Negociação': status || 'Em Avaliação',
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

    if (offerDate) {
      marketFields['Data da Oferta'] = offerDate;
    }

    if (vetoDate) {
      marketFields['Data do Veto'] = vetoDate;
    }

    if (targetPlayerId) {
      marketFields['Jogador'] = [targetPlayerId];
    }

    const marketRes = await fetch(createMarketUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{ fields: marketFields }],
        typecast: true // Força o Airtable a formatar tudo o que faltar
      }),
    });

    if (!marketRes.ok) {
      const err = await marketRes.json();
      console.error("Erro ao criar Oportunidade de Mercado:", err);
      return NextResponse.json({ error: err }, { status: marketRes.status });
    }

    const newMarket = await marketRes.json();
    return NextResponse.json({ success: true, record: newMarket.records[0] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}