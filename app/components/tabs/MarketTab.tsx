'use client';

import React from 'react';
import { Briefcase, Plus, Sliders, ArrowRight } from 'lucide-react';
import { Player, MarketOpportunity, DecisionFormData } from '../../types';

interface MarketTabProps {
  marketOpportunities: MarketOpportunity[];
  players: Player[];
  setIsMarketModalOpen: (open: boolean) => void;
  setSelectedMarketOppToEdit: (opp: any) => void;
  setDecisionFormData: React.Dispatch<React.SetStateAction<DecisionFormData>>;
  setSelectedPlayer: (player: Player) => void;
  setProfileTab: (tab: any) => void;
  isDarkMode: boolean;
}

export default function MarketTab({
  marketOpportunities,
  players,
  setIsMarketModalOpen,
  setSelectedMarketOppToEdit,
  setDecisionFormData,
  setSelectedPlayer,
  setProfileTab,
  isDarkMode
}: MarketTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-6 rounded-2xl border border-pink-500/30 shadow-xl space-y-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/40 pb-4 gap-4">
          <div>
            <h2 className="text-base md:text-lg font-bold uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-pink-500" /> Painel de Oportunidades de Mercado
            </h2>
            <p className={`text-xs ${themeTextMuted} mt-0.5`}>
              Mapeamento global de atletas oferecidos e em prospeção para as janelas de transferência.
            </p>
          </div>
          <button 
            onClick={() => setIsMarketModalOpen(true)}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-pink-900/20 transition"
          >
            <Plus className="w-4 h-4" /> Nova Oportunidade
          </button>
        </div>

        {marketOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketOpportunities.map((opp) => {
              const fields = opp.fields || {};
              const linkedPlayers = fields.Jogador || [];
              const playerRecord = players.find(p => linkedPlayers.includes(p.id));
              const status = fields['Status Negociação'] || 'Em Avaliação';

              let statusColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
              if (status === 'Aprovado' || status === 'Concluído') statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              if (status === 'Vetado') statusColor = 'bg-red-500/20 text-red-400 border-red-500/30';
              if (status === 'Em Negociação') statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';

              return (
                <div key={opp.id} className={`${themeInnerCard} p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:border-pink-500/40 transition`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {playerRecord ? playerRecord.name : (fields['Nome do Jogador'] || 'Atleta sem nome')}
                      </h3>
                      <p className={`text-xs ${themeTextMuted} mt-0.5`}>
                        <span className="text-pink-400 font-semibold">{playerRecord?.position || 'N/D'}</span> • {playerRecord?.club || 'Clube N/D'}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${statusColor}`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Mercado Target</span>
                      <span className="font-semibold text-slate-200">{fields['Mercado Target'] || 'N/D'}</span>
                    </div>
                    <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                      <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Viabilidade</span>
                      <span className="font-semibold text-slate-200">{fields['Viabilidade Financeira'] || 'N/D'}</span>
                    </div>
                  </div>

                  {fields['Motivo da Contratação'] && (
                    <p className={`text-xs ${themeTextMuted} italic bg-slate-900/30 p-3 rounded-lg border border-slate-800 line-clamp-2`}>
                      &quot;{fields['Motivo da Contratação']}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-[11px]">
                    <span className={themeTextMuted}>Ref: <strong>{fields['Scout'] || 'Departamento'}</strong></span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMarketOppToEdit(opp);
                          setDecisionFormData({
                            status: fields['Status Negociação'] || 'Em Avaliação',
                            vetoReason: fields['Motivo do Veto'] || '',
                            vetoDate: fields['Data do Veto'] || new Date().toISOString().split('T')[0],
                            presidentOpinion: fields['Opinião do Presidente'] || '',
                            notesDD: fields['Notas Diretor Desportivo'] || ''
                          });
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <Sliders className="w-3 h-3" /> Decisão
                      </button>

                      {playerRecord && (
                        <button
                          onClick={() => {
                            setSelectedPlayer(playerRecord);
                            setProfileTab('market');
                          }}
                          className="text-pink-400 hover:underline font-bold flex items-center gap-1"
                        >
                          Ver no Perfil <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-16 ${themeInnerCard} rounded-2xl border border-dashed text-xs md:text-sm space-y-2`}>
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="font-bold text-slate-300">Sem oportunidades registadas</p>
            <p className={`${themeTextMuted} text-xs`}>Clica em &quot;Nova Oportunidade&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}