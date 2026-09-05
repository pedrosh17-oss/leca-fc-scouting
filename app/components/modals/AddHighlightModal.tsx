'use client';

import React from 'react';
import { X, UserPlus } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { Player } from '../../types';

interface AddHighlightModalProps {
  isOpen: { matchId: string; matchName: string } | null;
  onClose: () => void;
  newHighlightData: { playerId: string; notes: string };
  setNewHighlightData: React.Dispatch<React.SetStateAction<{ playerId: string; notes: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  players: Player[];
  openNewPlayerModalForMatch: (matchName: string) => void;
  isDarkMode: boolean;
}

export default function AddHighlightModal({
  isOpen,
  onClose,
  newHighlightData,
  setNewHighlightData,
  onSubmit,
  players,
  openNewPlayerModalForMatch,
  isDarkMode,
}: AddHighlightModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200`}>
        <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
          <div>
            <h3 className="font-bold text-base md:text-sm">Adicionar Atleta ao Jogo</h3>
            <p className={`text-[10px] md:text-xs ${themeTextMuted} mt-0.5 truncate max-w-[250px]`}>{isOpen.matchName}</p>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} text-slate-400 hover:text-white rounded-full`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm md:text-xs">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`${themeTextMuted} font-bold`}>Procurar na Base de Dados</label>
              <button 
                type="button" 
                onClick={() => openNewPlayerModalForMatch(isOpen.matchName)} 
                className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1 font-bold text-[10px] md:text-xs"
              >
                <UserPlus className="w-3 h-3" /> Novo Atleta
              </button>
            </div>
            <CustomSelect
              options={players.map(p => ({ value: p.id, label: `${p.name} (${p.position})`, image: p.photo }))}
              value={newHighlightData.playerId} 
              onChange={val => setNewHighlightData({ ...newHighlightData, playerId: val })}
              placeholder="Pesquisar atleta..." 
              searchable={true} 
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`block ${themeTextMuted} font-bold mb-1.5`}>Avaliação</label>
            <textarea 
              rows={4} required placeholder="Análise individual do atleta..."
              value={newHighlightData.notes} 
              onChange={e => setNewHighlightData({ ...newHighlightData, notes: e.target.value })}
              className={`w-full border rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-sans resize-none shadow-inner ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
            />
          </div>

          <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mt-4`}>
            <button type="button" onClick={onClose} className={`flex-1 px-4 py-2.5 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl`}>
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
              Adicionar Destaque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}