'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Scout, Match } from '../../types';

interface ScoutsTabProps {
  displayScouts: Scout[];
  scoutMarketAssignments: Record<string, string[]>;
  setSelectedScout: (s: Scout) => void;
  getUserTitle: (name: string) => string;
  getScoutMatches: (name: string) => Match[];
  matches?: Match[];
  isDarkMode: boolean;
}

export default function ScoutsTab({
  displayScouts, scoutMarketAssignments, setSelectedScout, getUserTitle, getScoutMatches, matches = [], isDarkMode
}: ScoutsTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const scoutsOnly = displayScouts.filter(s => {
    const title = getUserTitle(s.name).toLowerCase();
    return title.includes('scout');
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {scoutsOnly.map((scout) => {
        const assigned = scoutMarketAssignments[scout.id] || [];
        const scoutNameLower = (scout.name || '').trim().toLowerCase();
        
        const countFromMatches = matches.filter(m => {
          const matchScout = (m.scout || '').trim().toLowerCase();
          return matchScout.includes(scoutNameLower) || (m.scoutIds && m.scoutIds.includes(scout.id));
        }).length;

        const totalMatches = countFromMatches || getScoutMatches(scout.name).length;

        return (
          <div 
            key={scout.id} 
            onClick={() => setSelectedScout(scout)}
            className={`${themeCard} border rounded-xl p-5 hover:border-blue-500/50 transition flex flex-col shadow-sm cursor-pointer group`}
          >
            <div className="flex items-center gap-4 mb-5">
              {scout.photo ? (
                <img src={scout.photo} alt={scout.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md group-hover:border-blue-500 transition" />
              ) : (
                <div className={`w-14 h-14 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border-2 flex items-center justify-center font-bold text-xl shadow-md group-hover:border-blue-500 transition`}>
                  {scout.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-base leading-tight group-hover:text-blue-500 transition">{scout.name}</h3>
                <p className="text-[10px] md:text-xs text-blue-500 font-bold mt-0.5">{getUserTitle(scout.name)}</p>
              </div>
            </div>

            <div className={`${themeInnerCard} p-3 rounded-lg border mb-4 flex-1`}>
              <span className={`text-[9px] ${themeTextMuted} uppercase font-bold tracking-wider block mb-2 flex items-center gap-1`}>
                <Globe className="w-3 h-3" /> Mercados Atribuídos ({assigned.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {assigned.length > 0 ? (
                  assigned.map((m, idx) => (
                    <span key={idx} className={`text-[10px] ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'} px-2 py-0.5 rounded border font-medium`}>
                      {m}
                    </span>
                  ))
                ) : (
                  <span className={`text-[10px] ${themeTextMuted} italic`}>Sem mercados atribuídos.</span>
                )}
              </div>
            </div>

            <div className={`flex justify-between items-center text-center pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`flex-1 border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="block text-lg font-bold text-emerald-500">{totalMatches}</span>
                <span className={`block text-[8px] md:text-[9px] ${themeTextMuted} uppercase font-bold mt-0.5`}>Jogos Vistos</span>
              </div>
              <div className={`flex-1 text-[10px] ${themeTextMuted} space-y-0.5 flex flex-col justify-center`}>
                <div><span className="text-blue-500 font-bold">{scout.liveMatches || 0}</span> Live</div>
                <div><span className="font-bold">{scout.streamMatches || 0}</span> Vídeo</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}