'use client';

import React from 'react';
import { Sliders, X, Flag, Loader2 } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { DecisionFormData } from '../../types';

interface MarketDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionFormData: DecisionFormData;
  setDecisionFormData: React.Dispatch<React.SetStateAction<DecisionFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  updatingDecision: boolean;
  isDarkMode: boolean;
}

export default function MarketDecisionModal({
  isOpen,
  onClose,
  decisionFormData,
  setDecisionFormData,
  onSubmit,
  updatingDecision,
  isDarkMode
}: MarketDecisionModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border border-pink-500/30 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 border border-pink-500/30 text-pink-500 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Atualizar Decisão de Mercado</h2>
              <p className={`text-xs ${themeTextMuted}`}>Registar pareceres da Direção, Presidente ou Vetos.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5 uppercase`}>Estado da Negociação *</label>
            <CustomSelect
              options={[
                { value: 'Em Avaliação', label: 'Em Avaliação (Entrada)' },
                { value: 'Em Negociação', label: 'Em Negociação' },
                { value: 'Aprovado', label: 'Aprovado / Contratado' },
                { value: 'Vetado', label: 'Vetado / Descartado' }
              ]}
              value={decisionFormData.status}
              onChange={v => setDecisionFormData({ ...decisionFormData, status: v })}
              isDarkMode={isDarkMode}
            />
          </div>

          {decisionFormData.status === 'Vetado' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-4 h-4"/> Registo de Veto
              </h4>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1`}>Data do Veto</label>
                <input 
                  type="date" 
                  value={decisionFormData.vetoDate} 
                  onChange={e => setDecisionFormData({ ...decisionFormData, vetoDate: e.target.value })} 
                  className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1`}>Motivo Principal do Veto *</label>
                <textarea 
                  rows={2} 
                  value={decisionFormData.vetoReason} 
                  onChange={e => setDecisionFormData({ ...decisionFormData, vetoReason: e.target.value })} 
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                  placeholder="Ex: Pedido financeiro fora de teto / Comportamento..." 
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Opinião do Presidente</label>
            <textarea rows={2} value={decisionFormData.presidentOpinion} onChange={e => setDecisionFormData({ ...decisionFormData, presidentOpinion: e.target.value })} className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} placeholder="Notas diretas da presidência..." />
          </div>

          <div>
            <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Notas do Diretor Desportivo</label>
            <textarea rows={2} value={decisionFormData.notesDD} onChange={e => setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })} className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} placeholder="Observações de gestão/agente..." />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition">Cancelar</button>
            <button type="submit" disabled={updatingDecision} className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition">
              {updatingDecision ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Decisão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}