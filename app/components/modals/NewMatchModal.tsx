'use client';

import React from 'react';
import { Trophy, X, Loader2 } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import CustomMultiSelect from '../ui/CustomMultiSelect';
import { Team, Scout } from '../../types';

interface NewMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  preGameData: {
    homeTeamId: string;
    awayTeamId: string;
    gameDate: string;
    competitionId: string;
    scoutIds: string[];
    type: string;
  };
  setPreGameData: React.Dispatch<React.SetStateAction<{
    homeTeamId: string;
    awayTeamId: string;
    gameDate: string;
    competitionId: string;
    scoutIds: string[];
    type: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  submittingPre: boolean;
  teams: Team[];
  competitions: Array<{ id: string; name: string }>;
  displayScouts: Scout[];
  isDarkMode: boolean;
}

export default function NewMatchModal({
  isOpen,
  onClose,
  preGameData,
  setPreGameData,
  onSubmit,
  submittingPre,
  teams,
  competitions,
  displayScouts,
  isDarkMode
}: NewMatchModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border w-full max-w-xl rounded-2xl shadow-2xl p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]`}>
        <div className={`flex justify-between items-center mb-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-500 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Agendar Novo Jogo</h2>
              <p className={`text-[10px] md:text-xs ${themeTextMuted} mt-0.5`}>Criar partida na agenda de observação</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Equipa Casa *</label>
              <CustomSelect 
                options={teams.map(t => ({ value: t.id, label: t.name, image: t.logo }))} 
                value={preGameData.homeTeamId} 
                onChange={val => setPreGameData({ ...preGameData, homeTeamId: val })} 
                placeholder="Procurar..." 
                searchable={true} 
                isDarkMode={isDarkMode} 
              />
            </div>
            <div>
              <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Equipa Visitante *</label>
              <CustomSelect 
                options={teams.map(t => ({ value: t.id, label: t.name, image: t.logo }))} 
                value={preGameData.awayTeamId} 
                onChange={val => setPreGameData({ ...preGameData, awayTeamId: val })} 
                placeholder="Procurar..." 
                searchable={true} 
                isDarkMode={isDarkMode} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Data do Jogo *</label>
              <input 
                type="date" 
                required 
                value={preGameData.gameDate} 
                onChange={e => setPreGameData({ ...preGameData, gameDate: e.target.value })} 
                className={`w-full border rounded-xl p-3 focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`} 
              />
            </div>
            <div>
              <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Tipo de Observação</label>
              <CustomSelect 
                options={[{ value: '🏟️ Live', label: 'Live', icon: '🏟️' }, { value: '💻 Stream', label: 'Stream', icon: '💻' }]} 
                value={preGameData.type} 
                onChange={val => setPreGameData({ ...preGameData, type: val })} 
                placeholder="Selecionar..." 
                isDarkMode={isDarkMode} 
              />
            </div>
          </div>

          <div>
            <label className={`block ${themeTextMuted} font-bold mb-1.5 flex items-center justify-between`}>
              <span>Scouts Observadores</span>
            </label>
            <CustomMultiSelect 
              options={displayScouts.map(s => ({ value: s.id, label: s.name, image: s.photo }))} 
              selectedIds={preGameData.scoutIds} 
              onChange={(ids: string[]) => setPreGameData({ ...preGameData, scoutIds: ids })} 
              placeholder="Selecionar Scouts..." 
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Competição / Liga</label>
            <CustomSelect 
              options={competitions.map(c => ({ value: c.id, label: c.name }))} 
              value={preGameData.competitionId} 
              onChange={val => setPreGameData({ ...preGameData, competitionId: val })} 
              placeholder="Procurar Competição..." 
              searchable={true} 
              isDarkMode={isDarkMode} 
            />
          </div>

          <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mt-6`}>
            <button type="button" onClick={onClose} className={`flex-1 px-4 py-3 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl`}>
              Cancelar
            </button>
            <button type="submit" disabled={submittingPre} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
              {submittingPre ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Agendar Jogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}