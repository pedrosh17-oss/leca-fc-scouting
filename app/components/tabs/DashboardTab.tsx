'use client';

import React from 'react';
import { Activity, Trophy, Search, Star, ArrowRight, ExternalLink, Briefcase, Plus } from 'lucide-react';
import { Player, Match, Team, Scout } from '../../types';

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
  setActiveTab: (tab: any) => void;
  getRecentHighlights: () => any[];
  navigateToMatch: (matchId: string) => void;
  isDarkMode: boolean;
}

export default function DashboardTab({
  players,
  matches,
  teams,
  displayScouts,
  canCreateMatches,
  authScoutId,
  preGameData,
  setPreGameData,
  setIsMarketModalOpen,
  setIsRegisterOpen,
  setActiveTab,
  getRecentHighlights,
  navigateToMatch,
  isDarkMode
}: DashboardTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className={`${themeCard} p-4 md:p-5 rounded-2xl border flex flex-col justify-between`}>
          <span className={`${themeTextMuted} text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1`}>Base de Atletas</span>
          <span className="text-2xl md:text-3xl font-black">{players.length}</span>
          <span className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1"><Activity size={10}/> Atleta(s) Ativos</span>
        </div>
        
        <div className={`${themeCard} p-4 md:p-5 rounded-2xl border flex flex-col justify-between`}>
          <span className={`${themeTextMuted} text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1`}>Jogos Vistos</span>
          <span className="text-2xl md:text-3xl font-black text-blue-500">{matches.length}</span>
          <span className={`text-[10px] ${themeTextMuted} font-medium mt-2`}>Mapeados na Época</span>
        </div>

        <div className={`${themeCard} p-4 md:p-5 rounded-2xl border flex flex-col justify-between`}>
          <span className={`${themeTextMuted} text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1`}>Equipas Mapeadas</span>
          <span className="text-2xl md:text-3xl font-black">{teams.length}</span>
          <span className={`text-[10px] ${themeTextMuted} font-medium mt-2`}>Clubes em BD</span>
        </div>

        <div className={`${themeCard} p-4 md:p-5 rounded-2xl border flex flex-col justify-between`}>
          <span className={`${themeTextMuted} text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1`}>Equipa de Scouts</span>
          <span className="text-2xl md:text-3xl font-black text-emerald-500">{displayScouts.length}</span>
          <span className={`text-[10px] ${themeTextMuted} font-medium mt-2`}>Observadores no Terreno</span>
        </div>
      </div>

      {/* ATALHOS */}
      {canCreateMatches && (
        <div className={`${themeCard} p-4 md:p-6 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}>
          <div>
            <h3 className="font-bold text-base md:text-lg">Atalhos do Departamento</h3>
            <p className={`text-xs ${themeTextMuted} mt-0.5`}>Ações rápidas para acompanhamento das partidas e prospeção</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-3">
            <button onClick={() => setIsMarketModalOpen(true)} className="flex-1 sm:flex-none px-4 py-3 bg-pink-600 hover:bg-pink-500 text-white text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
              <Briefcase className="w-4 h-4" /> Nova Oportunidade
            </button>
            <button onClick={() => { setPreGameData({ ...preGameData, scoutIds: authScoutId ? [authScoutId] : [] }); setIsRegisterOpen(true); }} className="flex-1 sm:flex-none px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
              <Plus className="w-4 h-4" /> Agendar Jogo
            </button>
            <button onClick={() => setActiveTab('players')} className={`flex-1 sm:flex-none px-4 py-3 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'} border text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2`}>
              <Search className="w-4 h-4" /> Pesquisar Atleta
            </button>
          </div>
        </div>
      )}

      {/* ÚLTIMAS OBSERVAÇÕES */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-500" /> Últimas Observações Submetidas
          </h3>
          <button onClick={() => setActiveTab('matches')} className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1">
            Ver Todos os Jogos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getRecentHighlights().map((p, idx) => (
            <div key={idx} className={`${themeCard} border p-4 rounded-2xl space-y-3 transition`}>
              <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                <div className="flex items-center gap-3">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-sm`}>
                      {(p.name || 'J').charAt(0)}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-sm">{p.name}</h5>
                    <p className={`text-xs ${themeTextMuted} mt-0.5`}>
                      <span className="text-blue-500 font-medium">{p.position}</span> • {p.club}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'} px-2 py-1 rounded font-semibold flex items-center gap-1`}>
                  {p.gameDate}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${themeInnerCard} p-3 rounded-xl border line-clamp-3`}>
                {p.note}
              </p>
              
              <button 
                onClick={() => navigateToMatch(p.matchId)}
                className="text-[10px] text-blue-500 font-bold hover:underline flex items-center justify-end w-full gap-1 pt-1"
              >
                Ir para Jogo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}