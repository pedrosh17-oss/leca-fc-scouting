'use client';

import React from 'react';
import { Briefcase, Plus, Sliders, CheckCircle2, ShieldAlert, Building2, Info } from 'lucide-react';
import { Player, MarketFormData, DecisionFormData } from '../../../types';

interface ProfileMarketTabProps {
  selectedPlayer: Player;
  marketOpportunities: any[];
  canSeeMarket: boolean;
  setMarketFormData: React.Dispatch<React.SetStateAction<MarketFormData>>;
  setIsMarketModalOpen: (open: boolean) => void;
  setSelectedMarketOppToEdit: (opp: any) => void;
  setDecisionFormData: React.Dispatch<React.SetStateAction<DecisionFormData>>;
  isDarkMode: boolean;
}

export default function ProfileMarketTab({
  selectedPlayer,
  marketOpportunities,
  canSeeMarket,
  setMarketFormData,
  setIsMarketModalOpen,
  setSelectedMarketOppToEdit,
  setDecisionFormData,
  isDarkMode
}: ProfileMarketTabProps) {
  if (!canSeeMarket) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const playerOpps = marketOpportunities.filter(opp => {
    const linked = opp.fields?.Jogador || [];
    return linked.includes(selectedPlayer.id);
  });

  const handleOpenDecision = (opp: any) => {
    const f = opp.fields || {};
    setSelectedMarketOppToEdit(opp);
    setDecisionFormData({
      status: f['Status Negociação'] || 'Em Avaliação',
      vetoReason: f['Motivo do Veto'] || '',
      vetoDate: f['Data do Veto'] || new Date().toISOString().split('T')[0],
      presidentOpinion: f['Opinião do Presidente'] || '',
      notesDD: f['Notas Diretor Desportivo'] || '',
      strengths: f['Pontos Fortes'] || '',
      weaknesses: f['Pontos Fracos'] || '',
    } as any);
  };

  const handleNewOpp = () => {
    setMarketFormData(prev => ({
      ...prev,
      playerId: selectedPlayer.id,
      name: selectedPlayer.name,
      club: selectedPlayer.club || '',
      position: selectedPlayer.position || '',
      foot: selectedPlayer.foot || '',
      birthDate: selectedPlayer.birthDate || ''
    }));
    setIsMarketModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-6 md:p-8 rounded-2xl border border-pink-500/20 relative overflow-hidden space-y-6`}>
        <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
          <div>
            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-pink-500" /> Histórico de Mercado & Decisões
            </h3>
            <p className={`text-xs ${themeTextMuted} mt-1`}>
              Registo dinâmico de propostas, pareceres da direção e status de contratação.
            </p>
          </div>
          <button 
            onClick={handleNewOpp}
            className="px-3.5 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 hover:bg-pink-600/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Registar Oportunidade
          </button>
        </div>

        {playerOpps.length > 0 ? (
          <div className="space-y-4">
            {playerOpps.map((opp) => {
              const f = opp.fields || {};
              const status = f['Status Negociação'] || 'Em Avaliação';
              
              let statusClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
              if (status.includes('Vetado') || status.includes('Caiu')) statusClass = 'bg-red-500/20 text-red-400 border-red-500/30';
              if (status.includes('Aprovado') || status.includes('Contratado')) statusClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

              return (
                <div key={opp.id} className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{f['Mercado Target'] || 'Janela N/D'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusClass}`}>{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] ${themeTextMuted}`}>Ref: <strong>{f['Scout'] || 'Departamento'}</strong></span>
                      <button
                        onClick={() => handleOpenDecision(opp)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <Sliders className="w-3 h-3" /> Decisão
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Viabilidade</span>
                      <span className="font-semibold text-emerald-400">{f['Viabilidade Financeira'] || '-'}</span>
                    </div>
                    <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Confiança L3 / L2</span>
                      <span className="font-semibold text-slate-200">{f['Confiança Liga 3'] || '-'}/3 • {f['Confiança Liga 2'] || '-'}/3</span>
                    </div>
                    <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Contrato</span>
                      <span className="font-semibold text-slate-200">{f['Contrato'] || '-'}</span>
                    </div>
                    <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Utilização</span>
                      <span className="font-semibold text-slate-200">{f['Utilização'] || '-'}</span>
                    </div>
                  </div>

                  {f['Motivo da Contratação'] && (
                    <div>
                      <span className={`block text-[10px] ${themeTextMuted} uppercase font-bold mb-1`}>Motivo da Referenciação</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{f['Motivo da Contratação']}</p>
                    </div>
                  )}

                  {(f['Pontos Fortes'] || f['Pontos Fracos']) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {f['Pontos Fortes'] && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Pontos Fortes
                          </span>
                          <p className="text-xs text-slate-200 whitespace-pre-line">{f['Pontos Fortes']}</p>
                        </div>
                      )}
                      {f['Pontos Fracos'] && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Pontos Fracos
                          </span>
                          <p className="text-xs text-slate-200 whitespace-pre-line">{f['Pontos Fracos']}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(f['Opinião do Presidente'] || f['Notas Diretor Desportivo']) && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Parecer da Direção
                      </span>
                      {f['Opinião do Presidente'] && (
                        <p className="text-xs text-slate-200"><span className="font-bold text-purple-300">Presidente:</span> {f['Opinião do Presidente']}</p>
                      )}
                      {f['Notas Diretor Desportivo'] && (
                        <p className="text-xs text-slate-200"><span className="font-bold text-purple-300">Direção Desportiva:</span> {f['Notas Diretor Desportivo']}</p>
                      )}
                    </div>
                  )}

                  {f['Motivo do Veto'] && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-2 mt-4">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Detalhes do Veto</span>
                      {f['Data do Veto'] && <span className="text-[10px] text-red-300/80 block">Data: {f['Data do Veto']}</span>}
                      {f['Motivo do Veto'] && <p className="text-xs text-red-200"><strong>Motivo:</strong> {f['Motivo do Veto']}</p>}
                      {f['Opinião do Presidente'] && <p className="text-xs text-red-200"><strong>Opinião da Direção:</strong> {f['Opinião do Presidente']}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-12 ${themeInnerCard} rounded-xl border border-dashed text-xs md:text-sm space-y-2`}>
            <Info className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="font-bold text-slate-400">Nenhum registo de mercado para este atleta</p>
          </div>
        )}
      </div>
    </div>
  );
}