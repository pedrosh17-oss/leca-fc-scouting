'use client';

import React from 'react';
import { X, Sliders, AlertTriangle, Trash2, ShieldCheck, Building2, Handshake } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { DecisionFormData } from '../../types';
import { getTheme } from '../../constants/theme';

interface MarketDecisionModalProps {
  selectedMarketOppToEdit: any;
  onClose: () => void;
  decisionFormData: DecisionFormData;
  setDecisionFormData: (data: DecisionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: (recordId: string) => void;
  updatingDecision: boolean;
  userRole?: string;
  isDarkMode: boolean;
}

export default function MarketDecisionModal({
  selectedMarketOppToEdit,
  onClose,
  decisionFormData,
  setDecisionFormData,
  onSubmit,
  onDelete,
  updatingDecision,
  userRole = 'SCOUT',
  isDarkMode,
}: MarketDecisionModalProps) {
  if (!selectedMarketOppToEdit) return null;

  const theme = getTheme(isDarkMode);
  const isAdmin = userRole === 'ADMIN';

  const currentStatus = decisionFormData.status;
  const isScoutPhase = currentStatus === 'Em Avaliação' || currentStatus.includes('Scouting');
  const isDirectionPhase = currentStatus.includes('Direção');
  const isNegotiationPhase = currentStatus.includes('Negociação') || currentStatus.includes('Contratado');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${theme.card} border border-pink-500/30 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 border border-pink-500/30 text-pink-500 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Gerir Fase & Decisão de Mercado</h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedMarketOppToEdit.fields?.['Nome do Jogador'] || 'Atleta em análise'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1.5 uppercase`}>Fase Atual do Processo *</label>
            <CustomSelect
              options={[
                { value: 'Em Avaliação', label: '📥 Em Avaliação (Entrada do Scouting)' },
                { value: 'Aprovado Scouting', label: '✅ Aprovado pelo Scouting' },
                { value: 'Vetado Scouting', label: '❌ Vetado pelo Scouting' },
                { value: 'Aprovado Direção', label: '💼 Aprovado pela Direção (Luz Verde)' },
                { value: 'Vetado Direção', label: '⛔ Vetado pela Direção' },
                { value: 'Em Negociação', label: '🤝 Em Negociação' },
                { value: 'Negociação Cancelada', label: '⚠️ Negociação Cancelada / Caiu' },
                { value: 'Fechado / Contratado', label: '🏆 Fechado / Contratado' },
              ]}
              value={decisionFormData.status}
              onChange={(v) => setDecisionFormData({ ...decisionFormData, status: v })}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* CAMPOS ESPECÍFICOS DA FASE DO SCOUTING */}
          {isScoutPhase && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Parecer Técnico do Scouting
              </h4>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Notas & Justificação do Observador</label>
                <textarea
                  rows={2}
                  value={decisionFormData.notesDD}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  placeholder="Avaliação das qualidades e encaixe na equipa..."
                />
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS DA FASE DA DIREÇÃO */}
          {isDirectionPhase && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Parecer da Presidência / Direção Desportiva
              </h4>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Opinião da Direção / Custo-Benefício</label>
                <textarea
                  rows={2}
                  value={decisionFormData.presidentOpinion}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, presidentOpinion: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  placeholder="Decisão financeira e enquadramento no teto salarial..."
                />
              </div>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Notas do Diretor Desportivo</label>
                <textarea
                  rows={2}
                  value={decisionFormData.notesDD}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  placeholder="Condições para avançar com proposta..."
                />
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS DE NEGOCIAÇÃO / FECHO */}
          {isNegotiationPhase && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Handshake className="w-4 h-4" /> Gestão da Negociação
              </h4>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Notas de Negociação / Termos da Proposta</label>
                <textarea
                  rows={2}
                  value={decisionFormData.notesDD}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  placeholder="Valores, comissões de agente, duração de contrato..."
                />
              </div>
            </div>
          )}

          {/* DETALHES DE VETO OU NEGÓCIO QUE CAIU */}
          {(currentStatus.includes('Vetado') || currentStatus === 'Negociação Cancelada') && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Motivo do Veto / Cancelamento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Data</label>
                  <input
                    type="date"
                    value={decisionFormData.vetoDate}
                    onChange={(e) => setDecisionFormData({ ...decisionFormData, vetoDate: e.target.value })}
                    className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Razão Principal *</label>
                  <input
                    type="text"
                    value={decisionFormData.vetoReason}
                    onChange={(e) => setDecisionFormData({ ...decisionFormData, vetoReason: e.target.value })}
                    className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                    placeholder="Ex: Pedido salarial fora de teto..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-800">
            {isAdmin && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(selectedMarketOppToEdit.id)}
                className="px-3.5 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                title="Eliminar permanentemente do Airtable"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button type="submit" disabled={updatingDecision} className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition">
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}