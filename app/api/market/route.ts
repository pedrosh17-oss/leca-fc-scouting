// PATCH: Atualizar Estado, Vetos e Notas de uma Oportunidade existente
export async function PATCH(request: Request) {
    try {
      const body = await request.json();
      const { recordId, status, vetoReason, vetoDate, presidentOpinion, notesDD } = body;
  
      if (!recordId) {
        return NextResponse.json({ error: 'Record ID é obrigatório' }, { status: 400 });
      }
  
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
      return NextResponse.json({ success: true, record: updated });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }