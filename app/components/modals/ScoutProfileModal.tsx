'use client';

import React from 'react';
import { X, Calendar, ExternalLink, Globe } from 'lucide-react';
import { Scout, Match } from '../../types';
import { getTheme } from '../../constants/theme';
import CustomMultiSelect from '../ui/CustomMultiSelect';

interface ScoutProfileModalProps {
  selectedScout: Scout | null;
  onClose: () => void;
  getScoutMatches: (scoutName: string) => Match[];
  scoutMarketAssignments: Record<string, string[]>;
  getUserTitle: (name: string) => string;
  isAdmin: boolean;
  getScoutMarketOptions: () => Array<{ value: string; label: string }>;
  handleSaveScoutMarkets: (scoutId: string, assignedMarkets: string[]) => void;
  navigateToMatch: (matchId: string) => void;
  isDarkMode: boolean;
}

export default function ScoutProfileModal({
  selectedScout,
  onClose,
  getScoutMatches,
  scoutMarketAssignments,
  getUserTitle,
  isAdmin,
  getScoutMarketOptions,
  handleSaveScoutMarkets,
  navigateToMatch,
  isDarkMode,
}: ScoutProfileModalProps) {
  if (!selectedScout) return null;

  const theme = getTheme(isDarkMode);
  const scoutMatches = getScoutMatches(selectedScout.name);
  const assignedMarkets = scoutMarketAssignments[selectedScout.id] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className={`${theme.card} border w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-5 md:p-6 space-y-6 animate-in fade-in zoom-in-95`}>
        
        <div className={`flex justify-between items-start border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
          <div className="flex items-center gap-4">
            {selectedScout.photo ? (
              <img src={selectedScout.photo} alt={selectedScout.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md flex-shrink-0" />
            ) : (
              <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-slate-800 border-blue-500' : 'bg-slate-200 border-blue-500'} border-2 flex items-center justify-center font-bold text-2xl flex-shrink-0`}>
                {selectedScout.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{selectedScout.name}</h2>
              <p className="text-xs text-blue-500 font-bold mt-1">{getUserTitle(selectedScout.name)}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} rounded-full text-slate-400 hover:text-white transition`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className={`${theme.card} p-4 rounded-xl border border-slate-700/50`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Jogos Observados</span>
            <span className="text-2xl font-black text-emerald-500">{scoutMatches.length}</span>
          </div>
          <div className={`${theme.card} p-4 rounded-xl border border-slate-700/50`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Live vs Stream</span>
            <span className="text-sm font-bold text-blue-500 mt-1 block">{selectedScout.liveMatches || 0} L / {selectedScout.streamMatches || 0} S</span>
          </div>
        </div>

        <div className={`${theme.card} p-4 rounded-xl border border-slate-700/50 space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider flex items-center gap-1.5`}>
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Mercados Atribuídos ({assignedMarkets.length})
            </h3>
            {isAdmin && (
              <span className="text-[10px] text-purple-500 font-bold uppercase">Edição do Head of Scout</span>
            )}
          </div>

          {isAdmin ? (
            <CustomMultiSelect 
              options={getScoutMarketOptions()} 
              selectedIds={assignedMarkets} 
              onChange={(ids: string[]) => handleSaveScoutMarkets(selectedScout.id, ids)} 
              placeholder="Atribuir mercados e séries..." 
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {assignedMarkets.length > 0 ? (
                assignedMarkets.map((m, idx) => (
                  <span key={idx} className={`text-xs ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'} px-3 py-1 rounded-lg border font-medium`}>
                    {m}
                  </span>
                ))
              ) : (
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} italic`}>Nenhum campeonato atribuído a este observador.</span>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>
            Histórico de Partidas Acompanhadas ({scoutMatches.length})
          </h3>
          {scoutMatches.length > 0 ? (
            <div className="space-y-2.5">
              {scoutMatches.map(m => (
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
                  <button 
                    onClick={() => { onClose(); navigateToMatch(m.id); }}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-500 text-xs font-bold rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    Ir para Jogo <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${theme.card} p-6 rounded-xl border border-slate-700/50 text-center`}>
              Ainda não existem jogos registados em nome deste observador no Match Center.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}