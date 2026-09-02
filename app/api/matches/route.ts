import { NextResponse } from 'next/server';

const BASE_ID = (process.env.AIRTABLE_BASE_ID || 'appxQowbIclSmyuol').trim();
const TOKEN = (
  process.env.AIRTABLE_PAT ||
  'patqtC0tvfQAgwxNc.77aafcd9ed5ae095f13fa5eb4535fbc437792ed541079158a0b5b2afacd38dd'
).trim();

function safeText(val: any, fallback: string = 'N/D'): string {
  if (!val) return fallback;
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Matches?maxRecords=100`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
      }
    );

    if (!res.ok) throw new Error('Falha ao carregar Matches');

    const data = await res.json();
    const matches = (data.records || []).map((r: any) => {
      const f = r.fields || {};
      return {
        id: r.id,
        matchName: safeText(f['Match'], 'Jogo sem Nome'),
        type: safeText(f['Type'], 'Live'),
        gameDate: safeText(f['Game Date'], 'N/D'),
        competition: safeText(f['Competition'], 'N/D'),
        homeTeam: safeText(f['Home Team'], 'N/D'),
        awayTeam: safeText(f['Away Team'], 'N/D'),
        homeTactic: safeText(f['Home Team Tactic'], '-'),
        awayTactic: safeText(f['Away Team Tactic'], '-'),
        scouts: safeText(f['Scouts'], 'Sem Scouts'),
        highlightsReport: safeText(
          f['Highlights Report'],
          'Nenhum destaque registado ainda.'
        ),
      };
    });

    return NextResponse.json({ matches });
  } catch (err) {
    return NextResponse.json({ matches: [] });
  }
}
