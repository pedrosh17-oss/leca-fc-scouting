'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface EditHighlightModalProps {
  editingHighlight: { matchId: string; matchName: string; player: any; highlightId: string | null; notes: string; } | null;
  onClose: () => void;
  setEditingHighlight: React.Dispatch<React.SetStateAction<{ matchId: string; matchName: string; player: any; highlightId: string | null; notes: string; } | null>>;
  onSubmit: (e: React.FormEvent) => void;
  savingHighlight: boolean;
  isDarkMode: boolean;
}

export default function EditHighlightModal({
  editingHighlight,
  onClose,
  setEditingHighlight,
  onSubmit,
  savingHighlight,
  isDarkMode,
}: EditHighlightModalProps) {
  if (!editingHighlight) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200`}>
        <div className={`flex justify-between items-start border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
          <div className="flex items-center gap-3 min-w-0">
            {editingHighlight.player.photo ? (
              <img src={editingHighlight.player.photo} alt={editingHighlight.player.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 flex-shrink-0" />
            ) : (
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0`}>
                {(editingHighlight.player.name || 'J').charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-sm md:text-base truncate">Editar: {editingHighlight.player.name}</h3>
              <p className={`text-[10px] md:text-xs ${themeTextMuted} mt-0.5 truncate`}>{editingHighlight.matchName}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white transition flex-shrink-0`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs md:text-sm">
          <div>
            <label className={`block ${themeTextMuted} font-bold mb-2`}>Avaliação Individual</label>
            <textarea 
              rows={6} required placeholder="Escreve a tua avaliação técnica/tática..."
              value={editingHighlight.notes} 
              onChange={e => setEditingHighlight({ ...editingHighlight, notes: e.target.value })}
              className={`w-full border rounded-xl p-3.5 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none shadow-inner ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
            />
          </div>

          <div className={`flex justify-end gap-3 pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} mt-4`}>
            <button type="button" onClick={onClose} className={`flex-1 md:flex-none px-4 py-2.5 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl`}>
              Cancelar
            </button>
            <button type="submit" disabled={savingHighlight} className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
              {savingHighlight ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Observação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}