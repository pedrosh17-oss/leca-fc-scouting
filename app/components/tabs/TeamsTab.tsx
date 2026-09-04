'use client';

import React, { useState, useMemo } from 'react';
import { Search, Building2, Plus } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { Team, Player, Match } from '../../types';

interface TeamsTabProps {
  filteredTeams: Team[];
  players: Player[];
  matches: Match[];
  setSelectedTeam: (team: Team) => void;
  canCreateMatches: boolean;
  setIsNewTeamOpen: (open: boolean) => void;
  isDarkMode: boolean;
}

export default function TeamsTab({
  filteredTeams, players, matches, setSelectedTeam,
  canCreateMatches, setIsNewTeamOpen, isDarkMode
}: TeamsTabProps) {
  
  // ESTADOS LOCAIS PARA EVITAR CONFLITO COM A ABA DE JOGADORES
  const [search, setSearch] = useState('');
  const [teamFilterComp, setTeamFilterComp] = useState('All');
  const [teamFilterStatus, setTeamFilterStatus] = useState('All');

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const uniqueTeamComps = useMemo(() => Array.from(new Set(filteredTeams.map(t => t.competition).filter(c => c && c !== 'N/D'))).sort(), [filteredTeams]);
  const uniqueTeamStatus = useMemo(() => Array.from(new Set(filteredTeams.map(t => t.status).filter(s => s && s !== 'N/D'))).sort(), [filteredTeams]);

  const displayedTeams = useMemo(() => {
    return filteredTeams.filter(team => {
      const matchSearch = (team.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (team.competition || '').toLowerCase().includes(search.toLowerCase()) ||
                          (team.country || '').toLowerCase().includes(search.toLowerCase());
      const matchComp = teamFilterComp === 'All' || team.competition === teamFilterComp;
      const matchStatus = teamFilterStatus === 'All' || team.status === teamFilterStatus;
      return matchSearch && matchComp && matchStatus;
    });
  }, [filteredTeams, search, teamFilterComp, teamFilterStatus]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 md:top-3.5 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
          <input 
            type="text" 
            placeholder="Pesquisar equipa..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className={`w-full border rounded-xl py-4 md:py-3.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-[#151c2c] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`} 
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 z-20">
          <CustomSelect options={[{ value: 'All', label: 'Todas as Ligas' }, ...uniqueTeamComps.map(c => ({ value: c, label: c }))]} value={teamFilterComp} onChange={setTeamFilterComp} className="w-full sm:w-48" isDarkMode={isDarkMode} />
          <CustomSelect options={[{ value: 'All', label: 'Todos os Estados' }, ...uniqueTeamStatus.map(s => ({ value: s, label: s }))]} value={teamFilterStatus} onChange={setTeamFilterStatus} className="w-full sm:w-48" isDarkMode={isDarkMode} />
          
          {canCreateMatches && (
            <button 
              onClick={() => setIsNewTeamOpen(true)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Criar Equipa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {displayedTeams.map((team) => {
          const teamPlayers = players.filter(p => (p.club || '').toLowerCase() === (team.name || '').toLowerCase());
          const teamMatchesCount = matches.filter(m => (m.matchName || '').toLowerCase().includes((team.name || '').toLowerCase())).length;

          return (
            <div key={team.id} onClick={() => setSelectedTeam(team)} className={`${themeCard} border rounded-xl p-4 md:p-5 flex items-center justify-between hover:border-slate-500 transition cursor-pointer shadow-sm`}>
              <div className="flex items-center gap-4 min-w-0">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} className="w-12 h-12 md:w-14 md:h-14 object-contain p-1.5 bg-slate-900 rounded-lg border border-slate-800 flex-shrink-0" />
                ) : (
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold flex-shrink-0`}><Building2 className="w-6 h-6 text-slate-400" /></div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-base truncate">{team.name}</h3>
                  <p className="text-xs text-blue-500 font-medium mt-1 truncate">
                    {team.competition && team.competition !== 'N/D' ? team.competition : ''} 
                    {team.competition && team.competition !== 'N/D' && team.country ? <span className="text-slate-400 hidden sm:inline"> • </span> : ''}
                    <span className="text-slate-400 hidden sm:inline">{team.country || ''}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-2">
                 <span className={`text-xs ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'} px-2 py-1 rounded-md font-bold`}>{teamMatchesCount} Jogos</span>
                 <span className={`text-[10px] ${themeTextMuted} font-medium`}>{teamPlayers.length} Atletas</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}