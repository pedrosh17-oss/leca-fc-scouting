'use client';

import React from 'react';
import { UserPlus, X, Loader2 } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { Team } from '../../types';
import { POSITIONS_OPTIONS } from '../../constants/options';

interface NewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPlayerData: { name: string; clubId: string; position: string };
  setNewPlayerData: React.Dispatch<React.SetStateAction<{ name: string; clubId: string; position: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  creatingPlayer: boolean;
  teams: Team[];
  availableMatchTeams: Array<{ id: string; name: string; logo?: string | null }>;
  isDarkMode: boolean;
}

export default function NewPlayerModal({
  isOpen,
  onClose,
  newPlayerData,
  setNewPlayerData,
  onSubmit,
  creatingPlayer,
  teams,
  availableMatchTeams,
  isDarkMode
}: NewPlayerModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const teamsList = availableMatchTeams.length > 0 ? availableMatchTeams : teams;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className={`${themeCard} border w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95`}>
        <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
          <h3 className="font-bold text-base md:text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-500" /> Criar Atleta
          </h3>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs md:text-sm">
          <div>
            <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Nome Completo</label>
            <input 
              type="text" 
              required 
              value={newPlayerData.name} 
              onChange={e => setNewPlayerData({ ...newPlayerData, name: e.target.value })} 
              className={`w-full border rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`} 
            />
          </div>
          <div>
            <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Clube Atual</label>
            <CustomSelect 
              options={teamsList.map(t => ({ value: t.id, label: t.name, image: t.logo }))} 
              value={newPlayerData.clubId} 
              onChange={val => setNewPlayerData({ ...newPlayerData, clubId: val })} 
              placeholder="Selecionar Clube..." 
              searchable={true} 
              isDarkMode={isDarkMode} 
            />
          </div>
          <div>
            <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Posição Principal</label>
            <CustomSelect 
              options={POSITIONS_OPTIONS.map(pos => ({ value: pos, label: pos }))} 
              value={newPlayerData.position} 
              onChange={val => setNewPlayerData({ ...newPlayerData, position: val })} 
              placeholder="Selecionar..." 
              searchable={true} 
              isDarkMode={isDarkMode} 
            />
          </div>
          <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mt-4`}>
            <button type="button" onClick={onClose} className={`flex-1 py-3 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl`}>Voltar</button>
            <button type="submit" disabled={creatingPlayer} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20">
              {creatingPlayer ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Atleta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}