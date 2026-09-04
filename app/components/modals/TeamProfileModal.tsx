'use client';

import React from 'react';
import { Building2, X, Calendar, UserCheck, ExternalLink } from 'lucide-react';
import { Team, Player, Match } from '../../types';
import { getTheme } from '../../constants/theme';

interface TeamProfileModalProps {
  selectedTeam: Team | null;
  onClose: () => void;
  players: Player[];
  matches: Match[];
  setSelectedPlayer: (p: Player) => void;
  setProfileTab: (tab: 'timeline' | 'algo' | 'market' | 'reports') => void;
  navigateToMatch: (matchId: string) => void;
  isDarkMode: boolean;
}

export default function TeamProfileModal({
  selectedTeam,
  onClose,
  players,
  matches,
  setSelectedPlayer,
  setProfileTab,
  navigateToMatch,
  isDarkMode,
}: TeamProfileModalProps) {
  if (!selectedTeam) return null;

  const theme = getTheme(isDarkMode);
  const teamPlayers = players.filter(p => (p.club || '').toLowerCase() === (selectedTeam.name || '').toLowerCase());
  const teamMatches = matches.filter(m => (m.matchName || '').toLowerCase().includes((selectedTeam.name || '').toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${theme.card} border w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-5 md:p-6 space-y-6 animate-in fade-in zoom-in-95`}>
        
        <div className={`flex justify-between items-start border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
          <div className="flex items-center gap-4">
            {selectedTeam.logo ? (
              <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-14 h-14 md:w-16 md:h-16 object-contain p-1.5 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0" />
            ) : (
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold flex-shrink-0`}>
                <Building2 className="w-7 h-7 text-slate-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{selectedTeam.name}</h2>
              <p className="text-xs text-blue-500 font-medium mt-1">
                {selectedTeam.competition && selectedTeam.competition !== 'N/D' ? selectedTeam.competition : ''}
                {selectedTeam.competition && selectedTeam.competition !== 'N/D' && selectedTeam.country ? <span className="text-slate-400"> • </span> : ''}
                {selectedTeam.country && <span className="text-slate-400">{selectedTeam.country}</span>}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white transition`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`${theme.card} p-4 rounded-xl border border-slate-700/50`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Jogos Observados</span>
            <span className="text-xl font-bold text-emerald-500">{teamMatches.length} Partidas</span>
          </div>
          <div className={`${theme.card} p-4 rounded-xl border border-slate-700/50`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Estatuto de Observação</span>
            <span className="text-xl font-bold text-blue-500">{selectedTeam.status || 'Monitored'}</span>
          </div>
        </div>

        <div>
          <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>
            Atletas de Interesse na Base de Dados ({teamPlayers.length})
          </h3>
          {teamPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamPlayers.map(p => (
                <div key={p.id} className={`${theme.card} p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between`}>
                  <div className="flex items-center gap-3 min-w-0">
                    {p.photo ? (
                      <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                        {(p.name || 'J').charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm truncate">{p.name}</h4>
                      <p className="text-xs text-blue-500 font-medium mt-0.5 truncate">{p.position}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      onClose();
                      setSelectedPlayer(p);
                      setProfileTab('timeline');
                    }}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 border border-blue-500/30 text-xs font-bold rounded-lg transition flex-shrink-0 ml-2"
                  >
                    Ver Perfil
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${theme.card} p-4 rounded-xl border border-slate-700/50 text-center`}>
              Ainda não existem atletas desta equipa registados na base de dados.
            </div>
          )}
        </div>

        <div>
          <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>
            Histórico de Jogos Observados ({teamMatches.length})
          </h3>
          {teamMatches.length > 0 ? (
            <div className="space-y-2.5">
              {teamMatches.map(m => (
                <div key={m.id} className={`${theme.card} p-3.5 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                  <div>
                    <h4 className="font-bold text-sm">{m.matchName}</h4>
                    <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {m.gameDate}</span>
                      <span>•</span>
                      <span className="text-blue-500 font-medium">{m.competition}</span>
                      <span>•</span>
                      <span className={`${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} px-1.5 py-0.5 rounded text-[10px]`}>{m.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100 border-slate-300'}`}>
                      <UserCheck className="w-3.5 h-3.5 text-blue-500"/> Scout: {m.scout}
                    </div>
                    <button 
                      onClick={() => { onClose(); navigateToMatch(m.id); }}
                      className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-500 text-[10px] md:text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      Ir para Jogo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${theme.card} p-4 rounded-xl border border-slate-700/50 text-center`}>
              Ainda não foram registados jogos observados desta equipa no Match Center.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}