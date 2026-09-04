'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, PieChart, ShieldAlert, Award, Filter } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { Player, Team } from '../../types';

interface PlayersTabProps {
  filteredPlayers: Player[];
  teams?: Team[];
  visibleCount: number;
  setVisibleCount: (n: number | ((prev: number) => number)) => void;
  setSelectedPlayer: (p: Player) => void;
  setProfileTab: (tab: 'timeline' | 'algo' | 'market' | 'reports') => void;
  setSelectedSeasonIdx: (idx: number) => void;
  isDarkMode: boolean;
}

const TACTICAL_ORDER: Record<string, number> = {
  'goalkeeper': 1, 'gk': 1, 'guarda-redes': 1,
  'center back': 2, 'cb': 2, 'defesa central': 2,
  'left back': 3, 'lb': 3, 'lateral esquerdo': 3,
  'right back': 4, 'rb': 4, 'lateral direito': 4,
  'defensive midfielder': 5, 'dm': 5, 'médio defensivo': 5,
  'center midfielder': 6, 'cm': 6, 'médio centro': 6,
  'offensive midfielder': 7, 'am': 7, 'om': 7, 'médio ofensivo': 7,
  'left winger': 8, 'lw': 8, 'extremo esquerdo': 8,
  'right winger': 9, 'rw': 9, 'extremo direito': 9,
  'forward': 10, 'striker': 10, 'st': 10, 'fw': 10, 'avançado': 10
};

export default function PlayersTab({
  filteredPlayers, teams = [],
  visibleCount, setVisibleCount, setSelectedPlayer, setProfileTab, setSelectedSeasonIdx, isDarkMode
}: PlayersTabProps) {
  
  // ESTADOS LOCAIS APENAS DESTA ABA (Impede o salto para as Equipas)
  const [search, setSearch] = useState('');
  const [localPosFilter, setLocalPosFilter] = useState('All');
  const [localStatusFilter, setLocalStatusFilter] = useState('All');
  const [localYearFilter, setLocalYearFilter] = useState('All');
  const [minAgeFilter, setMinAgeFilter] = useState<number>(15);
  const [maxAgeFilter, setMaxAgeFilter] = useState<number>(40);
  const [showStatsBanner, setShowStatsBanner] = useState(false);

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  // Opções 100% Exatas do Airtable (Sem Emojis Duplicados)
  const uniqueObservationStatuses = useMemo(() => {
    const statusSet = new Set<string>();
    filteredPlayers.forEach(p => {
      if (p.status) statusSet.add(p.status.trim());
    });
    return [{ value: 'All', label: 'Todos os Estados' }, ...Array.from(statusSet).sort().map(s => ({ value: s, label: s }))];
  }, [filteredPlayers]);

  const uniqueYears = useMemo(() => {
    const yearSet = new Set<number>();
    filteredPlayers.forEach(p => {
      if (p.birthYear) {
        yearSet.add(Number(p.birthYear));
      } else {
        const pAny = p as any;
        const birthRaw = p.birthDate || pAny.birth_date || pAny.dataNascimento;
        if (birthRaw && typeof birthRaw === 'string') {
          const yearMatch = birthRaw.match(/\b(19|20)\d{2}\b/);
          if (yearMatch) yearSet.add(Number(yearMatch[0]));
        } else if (p.age && p.age !== 'N/D' && typeof p.age !== 'object') {
          yearSet.add(2026 - Number(p.age));
        }
      }
    });
    const sortedYears = Array.from(yearSet).sort((a, b) => b - a);
    return [{ value: 'All', label: 'Ano Nascimento' }, ...sortedYears.map(y => ({ value: String(y), label: String(y) }))];
  }, [filteredPlayers]);

  const cleanUniquePositions = useMemo(() => {
    const posSet = new Set<string>();
    filteredPlayers.forEach(p => {
      if (!p.position || p.position === 'N/D') return;
      p.position.split(/[,/;\\]+/).map(s => s.trim()).filter(Boolean).forEach(pos => posSet.add(pos));
    });

    const sortedPositions = Array.from(posSet).sort((a, b) => {
      const rankA = TACTICAL_ORDER[a.toLowerCase()] || 99;
      const rankB = TACTICAL_ORDER[b.toLowerCase()] || 99;
      return rankA - rankB;
    });
    return [{ value: 'All', label: 'Todas as Posições' }, ...sortedPositions.map(p => ({ value: p, label: p }))];
  }, [filteredPlayers]);

  const processedPlayers = useMemo(() => {
    let list = filteredPlayers.filter(p => {
      const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.club || '').toLowerCase().includes(search.toLowerCase());
      
      const pPositions = (p.position || '').toLowerCase();
      const matchPos = localPosFilter === 'All' || pPositions.includes(localPosFilter.toLowerCase());
      
      const matchStatus = localStatusFilter === 'All' || p.status === localStatusFilter;
      
      let extractedYear = '';
      if (p.birthYear) extractedYear = String(p.birthYear);
      else {
        const pAny = p as any;
        const birthRaw = p.birthDate || pAny.birth_date || pAny.dataNascimento;
        if (birthRaw && typeof birthRaw === 'string') {
          const yearMatch = birthRaw.match(/\b(19|20)\d{2}\b/);
          if (yearMatch) extractedYear = yearMatch[0];
        } else if (p.age && p.age !== 'N/D' && typeof p.age !== 'object') {
          extractedYear = String(2026 - Number(p.age));
        }
      }
      const matchYear = localYearFilter === 'All' || extractedYear === localYearFilter;
      
      const pAge = typeof p.age === 'number' ? p.age : Number(p.age);
      const matchAge = isNaN(pAge) || (pAge >= minAgeFilter && pAge <= maxAgeFilter);

      return matchSearch && matchPos && matchStatus && matchYear && matchAge;
    });
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [filteredPlayers, search, localPosFilter, localStatusFilter, localYearFilter, minAgeFilter, maxAgeFilter]);

  const listToRender = processedPlayers.slice(0, visibleCount);

  const positionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalCount = 0;
    filteredPlayers.forEach(p => {
      if (!p.position || p.position === 'N/D') return;
      const positions = p.position.split(/[,/;\\]+/).map(s => s.trim()).filter(Boolean);
      positions.forEach(pos => { counts[pos] = (counts[pos] || 0) + 1; totalCount++; });
    });
    const total = totalCount || 1;
    return Object.entries(counts).map(([pos, count]) => ({ pos, count, pct: Math.round((count / total) * 100), rank: TACTICAL_ORDER[pos.toLowerCase()] || 99 })).sort((a, b) => a.rank - b.rank);
  }, [filteredPlayers]);

  const leagueStats = useMemo(() => {
    const teamMap = new Map<string, string>();
    teams.forEach(t => { if (t.name && t.competition && t.competition !== 'N/D') teamMap.set(t.name.trim().toLowerCase(), t.competition); });
    const counts: Record<string, number> = {};
    let totalCount = 0;
    filteredPlayers.forEach(p => {
      const pAny = p as any;
      const directComp = pAny.competition || pAny.league;
      const comp = (directComp && directComp !== 'N/D') ? directComp : (p.club ? teamMap.get(p.club.trim().toLowerCase()) || 'Outros Campeonatos' : 'Sem Clube');
      counts[comp] = (counts[comp] || 0) + 1;
      totalCount++;
    });
    const total = totalCount || 1;
    return Object.entries(counts).map(([comp, count]) => ({ comp, count, pct: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [filteredPlayers, teams]);

  const minPercent = ((minAgeFilter - 15) / (40 - 15)) * 100;
  const maxPercent = ((maxAgeFilter - 15) / (40 - 15)) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-5 md:p-6 rounded-2xl border border-blue-500/20 shadow-lg space-y-4`}>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowStatsBanner(!showStatsBanner)}>
          <div className="flex items-center gap-2.5">
            <PieChart className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider">Distribuição</h3>
            <span className="text-xs bg-blue-500/10 text-blue-500 font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20">{processedPlayers.length} Atletas</span>
          </div>
          <button className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{showStatsBanner ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
        </div>

        {showStatsBanner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-700/40">
            <div className="space-y-2.5">
              <span className={`text-[11px] font-bold ${themeTextMuted} uppercase tracking-wider flex items-center gap-1.5`}><Award className="w-3.5 h-3.5 text-emerald-500" /> Por Posição</span>
              <div className="grid grid-cols-2 gap-2">
                {positionStats.map((item, idx) => (
                  <div key={idx} className={`${themeInnerCard} p-2.5 rounded-xl border flex items-center justify-between`}>
                    <span className="text-xs font-bold truncate pr-2">{item.pos}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0"><span className="text-xs font-black text-emerald-500">{item.count}</span><span className={`text-[10px] ${themeTextMuted} font-semibold`}>({item.pct}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              <span className={`text-[11px] font-bold ${themeTextMuted} uppercase tracking-wider flex items-center gap-1.5`}><ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Por Campeonato</span>
              <div className="grid grid-cols-2 gap-2">
                {leagueStats.map((item, idx) => (
                  <div key={idx} className={`${themeInnerCard} p-2.5 rounded-xl border flex items-center justify-between`}>
                    <span className="text-xs font-bold truncate pr-2" title={item.comp}>{item.comp}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0"><span className="text-xs font-black text-blue-500">{item.count}</span><span className={`text-[10px] ${themeTextMuted} font-semibold`}>({item.pct}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Pesquisar atleta (A-Z) ou clube..." value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-[#151c2c] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`} />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <CustomSelect options={cleanUniquePositions} value={localPosFilter} onChange={setLocalPosFilter} className="w-full sm:w-44" isDarkMode={isDarkMode} />
            <CustomSelect options={uniqueObservationStatuses} value={localStatusFilter} onChange={setLocalStatusFilter} className="w-full sm:w-44" isDarkMode={isDarkMode} />
            <CustomSelect options={uniqueYears} value={localYearFilter} onChange={setLocalYearFilter} className="w-full sm:w-36" isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className={`${themeCard} px-4 py-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium`}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-blue-500" />
            <span className={`font-bold uppercase tracking-wider text-[11px] ${themeTextMuted}`}>Faixa Etária:</span>
            <span className="text-blue-500 font-bold font-mono ml-1">{minAgeFilter} - {maxAgeFilter} anos</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-1/2 mt-2 sm:mt-0 relative group pt-2 pb-2">
            <span className={`${themeTextMuted} font-bold`}>15</span>
            <div className="relative w-full h-1.5 bg-slate-700/60 rounded-full flex items-center">
              <div className="absolute h-full bg-blue-500 rounded-full pointer-events-none" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
              <input type="range" min="15" max="40" value={minAgeFilter} onChange={(e) => setMinAgeFilter(Math.min(Number(e.target.value), maxAgeFilter - 1))} className="absolute w-full h-2 appearance-none bg-transparent outline-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:appearance-none cursor-pointer" />
              <input type="range" min="15" max="40" value={maxAgeFilter} onChange={(e) => setMaxAgeFilter(Math.max(Number(e.target.value), minAgeFilter + 1))} className="absolute w-full h-2 appearance-none bg-transparent outline-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:appearance-none cursor-pointer" />
            </div>
            <span className={`${themeTextMuted} font-bold`}>40</span>
          </div>
        </div>
      </div>

      <div className={`flex justify-between items-center text-xs md:text-sm ${themeTextMuted} pt-2`}>
        <span>A mostrar {listToRender.length} de {processedPlayers.length} atletas.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listToRender.map((player) => (
          <div key={player.id} onClick={() => { setSelectedPlayer(player); setProfileTab('timeline'); setSelectedSeasonIdx(0); }} className={`${themeCard} border rounded-2xl p-4 hover:border-blue-500/50 transition cursor-pointer flex items-center justify-between gap-3 shadow-sm group`}>
            <div className="flex items-center gap-3.5 min-w-0">
              {player.photo ? <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover border border-slate-700 flex-shrink-0 group-hover:border-blue-500 transition" /> : <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:border-blue-500 transition`}>{(player.name || 'J').charAt(0)}</div>}
              <div className="min-w-0">
                <h4 className="font-bold text-sm md:text-base truncate group-hover:text-blue-500 transition">{player.name}</h4>
                <p className={`text-xs ${themeTextMuted} truncate mt-0.5`}><span className="text-blue-500 font-semibold">{player.position || 'Atleta'}</span>{player.club && <span> • {player.club}</span>}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{player.age && player.age !== 'N/D' && typeof player.age !== 'object' ? `${player.age} anos` : '--'}</span>
              <span className={`text-[10px] ${themeTextMuted} font-semibold`}>{player.status || 'Ativo'}</span>
            </div>
          </div>
        ))}
      </div>

      {processedPlayers.length > visibleCount && (
        <div className="flex justify-center pt-4">
          <button onClick={() => setVisibleCount(prev => prev + 20)} className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-500 hover:bg-blue-600/30 font-bold rounded-xl text-xs transition">Carregar Mais Jogadores ({processedPlayers.length - visibleCount} restantes)</button>
        </div>
      )}
    </div>
  );
}