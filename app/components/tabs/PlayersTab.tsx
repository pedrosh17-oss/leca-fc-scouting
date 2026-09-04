'use client';

import React from 'react';
import { Search, Filter, Shield } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { Player } from '../../types';

interface PlayersTabProps {
  search: string;
  setSearch: (s: string) => void;
  playerPositionFilter: string;
  setPlayerPositionFilter: (pos: string) => void;
  cleanPositionOptions: Array<{ value: string; label: string }>;
  playerStatusFilter: string;
  setPlayerStatusFilter: (status: string) => void;
  uniquePlayerStatuses: string[];
  birthYearFilter: string;
  setBirthYearFilter: (year: string) => void;
  uniqueBirthYears: string[];
  minAgeFilter: number;
  setMinAgeFilter: (age: number) => void;
  maxAgeFilter: number;
  setMaxAgeFilter: (age: number) => void;
  displayedPlayers: Player[];
  filteredPlayers: Player[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPlayer: (player: Player) => void;
  setProfileTab: (tab: any) => void;
  setSelectedSeasonIdx: (idx: number) => void;
  isDarkMode: boolean;
}

export default function PlayersTab({
  search,
  setSearch,
  playerPositionFilter,
  setPlayerPositionFilter,
  cleanPositionOptions,
  playerStatusFilter,
  setPlayerStatusFilter,
  uniquePlayerStatuses,
  birthYearFilter,
  setBirthYearFilter,
  uniqueBirthYears,
  minAgeFilter,
  setMinAgeFilter,
  maxAgeFilter,
  setMaxAgeFilter,
  displayedPlayers,
  filteredPlayers,
  visibleCount,
  setVisibleCount,
  setSelectedPlayer,
  setProfileTab,
  setSelectedSeasonIdx,
  isDarkMode
}: PlayersTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const minPercent = ((minAgeFilter - 15) / (40 - 15)) * 100;
  const maxPercent = ((maxAgeFilter - 15) / (40 - 15)) * 100;

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      {/* BARRA SUPERIOR DE FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Pesquisar atleta ou clube..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(20); }} 
            className={`w-full border rounded-xl py-3 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:border-blue-500 shadow-sm ${isDarkMode ? 'bg-[#151c2c] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`} 
          />
        </div>

        <CustomSelect 
          options={cleanPositionOptions} 
          value={playerPositionFilter} 
          onChange={setPlayerPositionFilter} 
          placeholder="Todas as Posições"
          searchable={true}
          isDarkMode={isDarkMode}
        />

        <CustomSelect 
          options={[{ value: 'All', label: 'Todos os Estados de Observação' }, ...uniquePlayerStatuses.map(s => ({ value: s, label: s }))]} 
          value={playerStatusFilter} 
          onChange={setPlayerStatusFilter} 
          placeholder="Estado de Observação"
          searchable={true}
          isDarkMode={isDarkMode}
        />

        <CustomSelect 
          options={[{ value: 'All', label: 'Todos os Anos Nasc.' }, ...uniqueBirthYears.map(y => ({ value: String(y), label: String(y) }))]} 
          value={birthYearFilter} 
          onChange={setBirthYearFilter} 
          placeholder="Ano de Nascimento"
          searchable={true}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* SLIDER FAIXA ETÁRIA */}
      <div className={`${themeCard} p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs`}>
        <div className="flex items-center gap-2 font-bold whitespace-nowrap">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Faixa Etária: <strong className="text-blue-500 font-black">{minAgeFilter} - {maxAgeFilter} anos</strong></span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-2/3">
          <span className={`${themeTextMuted} font-bold text-[11px]`}>15</span>
          <div className="relative w-full h-2 bg-slate-700/60 rounded-lg flex items-center">
            <div 
              className="absolute h-full bg-blue-500 rounded-lg transition-all duration-75"
              style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            />
            <input 
              type="range" 
              min="15" 
              max="40" 
              value={minAgeFilter} 
              onChange={(e) => setMinAgeFilter(Math.min(Number(e.target.value), maxAgeFilter - 1))}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none cursor-pointer"
            />
            <input 
              type="range" 
              min="15" 
              max="40" 
              value={maxAgeFilter} 
              onChange={(e) => setMaxAgeFilter(Math.max(Number(e.target.value), minAgeFilter + 1))}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none cursor-pointer"
            />
          </div>
          <span className={`${themeTextMuted} font-bold text-[11px]`}>40</span>
        </div>
      </div>

      <div className={`flex justify-between items-center mb-4 text-xs md:text-sm ${themeTextMuted}`}>
        <span>A mostrar {displayedPlayers.length} de {filteredPlayers.length} atletas.</span>
      </div>

      {/* GRELHA DE CARTÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {displayedPlayers.map((player) => (
          <div 
            key={player.id} 
            onClick={() => { setSelectedPlayer(player); setProfileTab('timeline'); setSelectedSeasonIdx(0); }}
            className={`${themeCard} border rounded-xl p-4 md:p-5 flex flex-col hover:border-blue-500/50 transition cursor-pointer group shadow-sm`}
          >
            <div className="flex items-center gap-4 mb-4">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-14 h-14 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 bg-slate-800" />
              ) : (
                <div className={`w-14 h-14 md:w-12 md:h-12 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-base md:text-sm`}>
                  {player.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate flex items-center gap-2">
                  {player.name}
                </h3>
                <div className={`flex items-center gap-1.5 text-xs md:text-[11px] ${themeTextMuted} mt-1 md:mt-0.5 truncate`}>
                  <span className="text-blue-500 font-medium truncate">{player.position}</span>
                </div>
              </div>
            </div>
            
            <div className={`flex justify-between items-center mt-auto pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
               <div className="flex items-center gap-2 text-xs md:text-sm">
                  {player.clubLogo ? <img src={player.clubLogo} alt={player.club} className="w-4 h-4 md:w-5 md:h-5 object-contain" /> : <Shield className="w-4 h-4 text-slate-400" />}
                  <span className="truncate max-w-[140px] font-medium">{player.club}</span>
               </div>
               <span className={`text-[10px] ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'} px-2 py-1 rounded-md font-bold uppercase tracking-wide`}>{player.status}</span>
            </div>
          </div>
        ))}
      </div>

      {!search && displayedPlayers.length < filteredPlayers.length && (
        <div className="text-center mt-8">
          <button onClick={() => setVisibleCount(prev => prev + 30)} className={`w-full md:w-auto px-8 py-4 md:py-3 ${themeCard} border font-medium text-sm md:text-base rounded-xl transition shadow-sm`}>
            Ver Mais Atletas
          </button>
        </div>
      )}
    </div>
  );
}