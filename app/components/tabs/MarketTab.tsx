'use client';

import React, { useState, useMemo } from 'react';
import { Briefcase, Plus, Sliders, ArrowRight, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Handshake, AlertTriangle, Trophy, Search } from 'lucide-react';
import { Player, Role } from '../../types';

interface MarketTabProps {
  marketOpportunities: any[];
  players: Player[];
  setIsMarketModalOpen: (open: boolean) => void;
  setSelectedMarketOppToEdit: (opp: any) => void;
  setDecisionFormData: (data: any) => void;
  setSelectedPlayer: (p: Player) => void;
  setProfileTab: (tab: 'timeline' | 'algo' | 'market' | 'reports') => void;
  userRole?: Role;
  isDarkMode: boolean;
}

const KANBAN_COLUMNS = [
  { id: 'Em Avaliação', title: '📥 Em Avaliação', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'Aprovado Scouting', title: '✅ Aprovado Scouting', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'Aprovado Direção', title: '💼 Aprovado Direção', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'Em Negociação', title: '🤝 Em Negociação', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'Fechado / Contratado', title: '🏆 Contratado', color: 'border-emerald-600 text-emerald-500 bg-emerald-600/20' },
  { id: 'Negociação Cancelada', title: '⚠️ Negócio Caiu', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
  { id: 'Vetado Scouting', title: '❌ Vetado Scouting', color: 'border-red-500/30 text-red-400 bg-red-500/5' },
  { id: 'Vetado Direção', title: '⛔ Vetado Direção', color: 'border-red-600/40 text-red-500 bg-red-600/10' },
];

export default function MarketTab({
  marketOpportunities,
  players,
  setIsMarketModalOpen,
  setSelectedMarketOppToEdit,
  setDecisionFormData,
  setSelectedPlayer,
  setProfileTab,
  userRole = 'SCOUT',
  isDarkMode,
}: MarketTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const isManagement = userRole === 'ADMIN' || userRole === 'DIRECTOR' || userRole === 'EXECUTIVE';

  // Filtragem de oportunidades por texto
  const filteredOpps = useMemo(() => {
    return marketOpportunities.filter(opp => {
      const f = opp.fields || {};
      const linkedPlayers = f.Jogador || [];
      const playerRecord = players.find(p => linkedPlayers.includes(p.id));
      const name = playerRecord ? playerRecord.name : (f['Nome do Jogador'] || '');
      const club = playerRecord ? playerRecord.club : (f['Clube'] || '');

      return name.toLowerCase().includes(searchTerm.toLowerCase()) || club.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [marketOpportunities, players, searchTerm]);

  // Função auxiliar para abrir formulário com o estado pretendido
  const openDecisionWithStatus = (opp: any, targetStatus: string) => {
    const f = opp.fields || {};
    setSelectedMarketOppToEdit(opp);
    setDecisionFormData({
      status: targetStatus,
      vetoReason: f['Motivo do Veto'] || '',
      vetoDate: f['Data do Veto'] || new Date().toISOString().split('T')[0],
      presidentOpinion: f['Opinião do Presidente'] || '',
      notesDD: f['Notas Diretor Desportivo'] || '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* CABEÇALHO DO PAINEL DE MERCADO */}
      <div className={`${themeCard} p-5 md:p-6 rounded-2xl border border-pink-500/30 shadow-xl space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/40 pb-4">
          <div>
            <h2 className="text-base md:text-lg font-bold uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-pink-500" /> Pipeline de Oportunidades & Mercado
            </h2>
            <p className={`text-xs ${themeTextMuted} mt-0.5`}>
              Fluxo de aprovação: Scouting $\rightarrow$ Direção $\rightarrow$ Negociação $\rightarrow$ Assinatura
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-[#0d131f] border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'kanban' ? 'bg-pink-600 text-white shadow' : 'text-slate-400'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'grid' ? 'bg-pink-600 text-white shadow' : 'text-slate-400'}`}
              >
                Lista
              </button>
            </div>

            <button
              onClick={() => setIsMarketModalOpen(true)}
              className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Nova Oportunidade
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar por atleta ou clube em mercado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
          />
        </div>
      </div>

      {/* VISTA KANBAN (COLUNAS HORIZONTAIS) */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 no-scrollbar min-h-[600px]">
          {KANBAN_COLUMNS.map((col) => {
            const columnOpps = filteredOpps.filter((opp) => {
              const st = opp.fields?.['Status Negociação'] || 'Em Avaliação';
              return st === col.id;
            });

            return (
              <div key={col.id} className={`w-80 flex-shrink-0 rounded-2xl border p-4 flex flex-col gap-3 ${isDarkMode ? 'bg-[#111723]/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </span>
                  <span className={`text-xs font-mono font-bold ${themeTextMuted}`}>
                    {columnOpps.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                  {columnOpps.map((opp) => {
                    const f = opp.fields || {};
                    const linkedPlayers = f.Jogador || [];
                    const playerRecord = players.find((p) => linkedPlayers.includes(p.id));
                    const currentStatus = f['Status Negociação'] || 'Em Avaliação';

                    return (
                      <div key={opp.id} className={`${themeCard} border rounded-xl p-4 space-y-3 shadow-md hover:border-pink-500/50 transition relative group`}>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-sm leading-snug">
                              {playerRecord ? playerRecord.name : (f['Nome do Jogador'] || 'Atleta sem nome')}
                            </h4>
                            <p className={`text-[11px] ${themeTextMuted} mt-0.5`}>
                              <span className="text-pink-400 font-semibold">{playerRecord?.position || f['Posição'] || 'N/D'}</span> • {playerRecord?.club || f['Clube'] || 'Clube N/D'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className={`${themeInnerCard} p-2 rounded-lg border`}>
                            <span className={`block ${themeTextMuted} uppercase font-bold`}>Target</span>
                            <span className="font-semibold text-slate-200 truncate block">{f['Mercado Target'] || 'N/D'}</span>
                          </div>
                          <div className={`${themeInnerCard} p-2 rounded-lg border`}>
                            <span className={`block ${themeTextMuted} uppercase font-bold`}>Viabilidade</span>
                            <span className="font-semibold text-emerald-400 truncate block">{f['Viabilidade Financeira'] || 'N/D'}</span>
                          </div>
                        </div>

                        {/* BOTÕES DE AÇÃO RÁPIDA POR TIPO DE LOGIN */}
                        <div className="pt-2 border-t border-slate-700/40 flex flex-col gap-1.5">
                          {/* AÇÕES DO SCOUTING (Em Avaliação) */}
                          {currentStatus === 'Em Avaliação' && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Aprovado Scouting')}
                                className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <ShieldCheck className="w-3 h-3" /> Aprovar Scout
                              </button>
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Vetado Scouting')}
                                className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <ShieldAlert className="w-3 h-3" /> Vetar
                              </button>
                            </div>
                          )}

                          {/* AÇÕES DA DIREÇÃO / GESTÃO */}
                          {isManagement && currentStatus === 'Aprovado Scouting' && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Aprovado Direção')}
                                className="flex-1 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Luz Verde
                              </button>
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Vetado Direção')}
                                className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <XCircle className="w-3 h-3" /> Veto Direção
                              </button>
                            </div>
                          )}

                          {/* AÇÕES DE NEGOCIAÇÃO (Direção) */}
                          {isManagement && currentStatus === 'Aprovado Direção' && (
                            <button
                              onClick={() => openDecisionWithStatus(opp, 'Em Negociação')}
                              className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                            >
                              <Handshake className="w-3.5 h-3.5" /> Iniciar Negociação
                            </button>
                          )}

                          {/* DESFECHO DA NEGOCIAÇÃO */}
                          {isManagement && currentStatus === 'Em Negociação' && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Fechado / Contratado')}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <Trophy className="w-3 h-3" /> Assinar
                              </button>
                              <button
                                onClick={() => openDecisionWithStatus(opp, 'Negociação Cancelada')}
                                className="flex-1 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <AlertTriangle className="w-3 h-3" /> Negócio Caiu
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className={`text-[9px] ${themeTextMuted}`}>Ref: {f['Scout'] || 'Dep.'}</span>
                            <button
                              onClick={() => openDecisionWithStatus(opp, currentStatus)}
                              className="text-pink-400 hover:underline font-bold text-[10px] flex items-center gap-0.5"
                            >
                              <Sliders className="w-2.5 h-2.5" /> Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnOpps.length === 0 && (
                    <div className="p-4 text-center border border-dashed rounded-xl text-[11px] text-slate-500 italic">
                      Sem atletas nesta fase.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA EM GRELHA / LISTA TRADICIONAL */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpps.map((opp) => {
            const f = opp.fields || {};
            const linkedPlayers = f.Jogador || [];
            const playerRecord = players.find(p => linkedPlayers.includes(p.id));
            const status = f['Status Negociação'] || 'Em Avaliação';

            return (
              <div key={opp.id} className={`${themeInnerCard} p-5 rounded-2xl border space-y-3`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{playerRecord ? playerRecord.name : (f['Nome do Jogador'] || 'Atleta')}</h3>
                    <p className={`text-xs ${themeTextMuted}`}>{playerRecord?.position || f['Posição']} • {playerRecord?.club || f['Clube']}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-pink-500/20 text-pink-400 border-pink-500/30">
                    {status}
                  </span>
                </div>
                <button onClick={() => openDecisionWithStatus(opp, status)} className="w-full py-2 bg-slate-800 text-pink-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Gerir Decisão
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}