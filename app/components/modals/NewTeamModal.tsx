'use client';

import React from 'react';
import { Building2, X, Loader2 } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';

interface NewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTeamData: { name: string; competitionId: string };
  setNewTeamData: React.Dispatch<React.SetStateAction<{ name: string; competitionId: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  creatingTeam: boolean;
  competitions: Array<{ id: string; name: string }>;
  isDarkMode: boolean;
}

export default function NewTeamModal({
  isOpen,
  onClose,
  newTeamData,
  setNewTeamData,
  onSubmit,
  creatingTeam,
  competitions,
  isDarkMode
}: NewTeamModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95`}>
        <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
          <h3 className="font-bold text-base md:text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" /> Criar Equipa
          </h3>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs md:text-sm">
          <div>
            <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Nome da Equipa</label>
            <input 
              type="text" 
              required 
              value={newTeamData.name} 
              onChange={e => setNewTeamData({ ...newTeamData, name: e.target.value })} 
              className={`w-full border rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`} 
              placeholder="Ex: Boavista FC"
            />
          </div>
          <div>
            <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Competição / Liga</label>
            <CustomSelect 
              options={competitions.map(c => ({ value: c.id, label: c.name }))} 
              value={newTeamData.competitionId} 
              onChange={val => setNewTeamData({ ...newTeamData, competitionId: val })} 
              placeholder="Selecionar Competição..." 
              searchable={true} 
              isDarkMode={isDarkMode}
            />
          </div>
          <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mt-4`}>
            <button type="button" onClick={onClose} className={`flex-1 py-3 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl`}>Voltar</button>
            <button type="submit" disabled={creatingTeam} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20">
              {creatingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Equipa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}