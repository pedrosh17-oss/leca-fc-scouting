'use client';

import React from 'react';
import { Users, Shield, Trophy, LayoutDashboard, Plus, Briefcase, FileText, CheckCircle, BarChart3, Search } from 'lucide-react';
import { Player, Team, Match, Scout } from '../../types';

interface DashboardTabProps {
  players: Player[];
  matches: Match[];
  teams: Team[];
  displayScouts: Scout[];
  canCreateMatches: boolean;
  authScoutId: string | null;
  preGameData: any;
  setPreGameData: (data: any) => void;
  setIsMarketModalOpen: (open: boolean) => void;
  setIsRegisterOpen: (open: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'players' | 'teams' | 'matches' | 'scouts' | 'admin' | 'stats' | 'market') => void;
  getRecentHighlights: () => any[];
  navigateToMatch: (matchId: string) => void;
  isDarkMode: boolean;
}

export default function DashboardTab({
  players, matches, teams, displayScouts, canCreateMatches, authScoutId, preGameData, setPreGameData,
  setIsMarketModalOpen, setIsRegisterOpen, setActiveTab, getRecentHighlights, navigateToMatch, isDarkMode
}: DashboardTabProps) {
  const recentHighlights = getRecentHighlights();
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';

  // 1. Cálculos de Controlo de Observação (Jogos Vistos por Equipa)
  const teamCoverage = React.useMemo(() => {
    const counts: Record<string, number> = {};
    matches.forEach(m => {
      const p = m.matchName.split(' x ');
      if (p.length === 2) {
        const home = p[0].trim();
        const away = p[1].trim();
        counts[home] = (counts[home] || 0) + 1;
        counts[away] = (counts[away] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Mostra o Top 5 equipas mais vistas
  }, [matches]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* KPIS GLOBAIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className={`${themeCard} p-4 md:p-6 rounded-2xl border cursor-pointer hover:border-blue-500/50 transition relative overflow-hidden`} onClick={() => setActiveTab('players')}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <span className={`text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-wider block mb-1 md:mb-2`}>Base de Atletas</span>
          <span className="text-2xl md:text-4xl font-black">{players.length}</span>
          <p className="text-[10px] md:text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Atleta(s) Ativos</p>
        </div>
        <div className={`${themeCard} p-4 md:p-6 rounded-2xl border cursor-pointer hover:border-blue-500/50 transition relative overflow-hidden`} onClick={() => setActiveTab('matches')}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <span className={`text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-wider block mb-1 md:mb-2`}>Jogos Vistos</span>
          <span className="text-2xl md:text-4xl font-black text-blue-500">{matches.length}</span>
          <p className={`text-[10px] md:text-xs ${themeTextMuted} font-medium mt-2`}>Mapeados na Época</p>
        </div>
        <div className={`${themeCard} p-4 md:p-6 rounded-2xl border cursor-pointer hover:border-blue-500/50 transition relative overflow-hidden hidden md:block`} onClick={() => setActiveTab('teams')}>
          <span className={`text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-wider block mb-1 md:mb-2`}>Equipas Mapeadas</span>
          <span className="text-2xl md:text-4xl font-black">{teams.length}</span>
          <p className={`text-[10px] md:text-xs ${themeTextMuted} font-medium mt-2`}>Clubes em BD</p>
        </div>
        <div className={`${themeCard} p-4 md:p-6 rounded-2xl border cursor-pointer hover:border-blue-500/50 transition relative overflow-hidden`} onClick={() => setActiveTab('scouts')}>
          <span className={`text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-wider block mb-1 md:mb-2`}>Equipa de Scouts</span>
          <span className="text-2xl md:text-4xl font-black text-emerald-500">{displayScouts.length}</span>
          <p className={`text-[10px] md:text-xs ${themeTextMuted} font-medium mt-2`}>Observadores no Terreno</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ATALHOS RÁPIDOS */}
          <div className={`${themeCard} p-5 md:p-6 rounded-2xl border`}>
            <h3 className="font-bold text-base md:text-lg mb-1">Atalhos do Departamento</h3>
            <p className={`text-xs md:text-sm ${themeTextMuted} mb-4`}>Ações rápidas para acompanhamento das partidas e prospeção</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsMarketModalOpen(true)} className="flex-1 py-3.5 md:py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl md:rounded-lg text-sm transition shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" /> Nova Oportunidade
              </button>
              {canCreateMatches && (
                <button onClick={() => { setPreGameData({ ...preGameData, scoutIds: authScoutId ? [authScoutId] : [] }); setIsRegisterOpen(true); }} className="flex-1 py-3.5 md:py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl md:rounded-lg text-sm transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Agendar Jogo
                </button>
              )}
              <button onClick={() => setActiveTab('players')} className={`flex-1 py-3.5 md:py-3 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} font-bold rounded-xl md:rounded-lg text-sm transition flex items-center justify-center gap-2 border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                <Search className="w-4 h-4" /> Pesquisar Atleta
              </button>
            </div>
          </div>

          {/* ÚLTIMAS OBSERVAÇÕES */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xs md:text-sm font-bold ${themeTextMuted} uppercase tracking-wider flex items-center gap-2`}>
                <FileText className="w-4 h-4 text-blue-500"/> Últimas Observações Submetidas
              </h3>
              <button onClick={() => setActiveTab('matches')} className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline">
                Ver Todos <span className="hidden sm:inline">os Jogos</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            {recentHighlights.length > 0 ? (
              <div className="space-y-3">
                {recentHighlights.map((hl, idx) => (
                  <div key={idx} onClick={() => navigateToMatch(hl.matchId)} className={`${themeCard} border rounded-2xl p-4 md:p-5 hover:border-blue-500/50 transition cursor-pointer flex items-start gap-4 shadow-sm group`}>
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-colors`}>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1.5">
                        <h4 className="font-bold text-sm md:text-base leading-tight group-hover:text-blue-500 transition line-clamp-1">{hl.name}</h4>
                        <span className={`text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-lg border ${isDarkMode ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'} whitespace-nowrap`}>
                          Scout: {hl.scout}
                        </span>
                      </div>
                      <p className={`text-[11px] md:text-xs ${themeTextMuted} truncate flex items-center gap-1.5 mb-2`}>
                        Em <span className="font-semibold text-slate-300">{hl.matchName}</span> ({hl.gameDate})
                      </p>
                      <p className={`text-xs md:text-sm line-clamp-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed font-sans`}>{hl.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${themeCard} border border-dashed rounded-2xl p-8 text-center`}>
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className={`text-sm ${themeTextMuted}`}>Não existem observações recentes.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* COBERTURA DE OBSERVAÇÃO */}
          <div className={`${themeCard} p-5 md:p-6 rounded-2xl border`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/40">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm md:text-base">Cobertura de Observação</h3>
            </div>
            <p className={`text-[11px] md:text-xs ${themeTextMuted} mb-4 leading-relaxed`}>Equipas observadas com maior frequência na presente época (Top 5).</p>
            
            {teamCoverage.length > 0 ? (
              <div className="space-y-3">
                {teamCoverage.map((team, idx) => {
                  const maxCount = teamCoverage[0].count;
                  const pct = Math.round((team.count / maxCount) * 100);
                  
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="truncate pr-2">{team.name}</span>
                        <span className="text-emerald-500">{team.count} {team.count === 1 ? 'jogo' : 'jogos'}</span>
                      </div>
                      <div className={`h-1.5 w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`text-xs ${themeTextMuted} text-center py-4`}>Ainda não há jogos registados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}