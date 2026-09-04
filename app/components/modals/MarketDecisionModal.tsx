'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, Sliders, AlertTriangle, Trash2, ShieldCheck, Building2, 
  Briefcase, History, Clock, CheckCircle2, XCircle, RotateCcw, 
  Trophy, Users, Save, ShieldAlert, ChevronDown, ChevronUp
} from 'lucide-react';
import { DecisionFormData } from '../../types';
import { getTheme } from '../../constants/theme';

interface MarketDecisionModalProps {
  selectedMarketOppToEdit: any;
  onClose: () => void;
  decisionFormData: DecisionFormData;
  setDecisionFormData: React.Dispatch<React.SetStateAction<DecisionFormData>> | ((data: any) => void);
  onSubmit: (e: React.FormEvent, overrideStatus?: string) => void;
  onDelete?: (recordId: string) => void;
  updatingDecision: boolean;
  userRole?: string;
  isDarkMode: boolean;
  marketLogs: any[];
}

const STATUS_CONFIG: Record<string, { title: string; color: string; bg: string; border: string }> = {
  'Em Avaliação': { title: '📥 Em Avaliação (Entrada do Scouting)', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'Aprovado Scouting': { title: '✅ Aprovado pelo Scouting', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'Vetado Scouting': { title: '❌ Vetado pelo Scouting', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  'Aprovado Direção': { title: '💼 Aprovado pela Direção (Luz Verde)', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  'Vetado Direção': { title: '⛔ Vetado pela Direção', color: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-600/30' },
  'Em Negociação': { title: '🤝 Em Negociação', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  'Negociação Cancelada': { title: '⚠️ Negociação Cancelada / Caiu', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  'Fechado / Contratado': { title: '🏆 Fechado / Contratado', color: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/40' },
};

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
  marketLogs = [],
}: MarketDecisionModalProps) {
  const [showManualOverride, setShowManualOverride] = useState(false);

  useEffect(() => {
    if (selectedMarketOppToEdit && selectedMarketOppToEdit.fields) {
      setDecisionFormData((prev: any) => ({
        ...prev,
        status: prev?.status || selectedMarketOppToEdit.fields['Status Negociação'] || 'Em Avaliação',
        strengths: prev?.strengths || selectedMarketOppToEdit.fields['Pontos Fortes'] || '',
        weaknesses: prev?.weaknesses || selectedMarketOppToEdit.fields['Pontos Fracos'] || '',
      }));
    }
  }, [selectedMarketOppToEdit, setDecisionFormData]);

  if (!selectedMarketOppToEdit) return null;

  const theme = getTheme(isDarkMode);
  const isAdmin = userRole === 'ADMIN';
  const isManagement = isAdmin || userRole === 'DIRECTOR' || userRole === 'EXECUTIVE';

  const currentStatus = decisionFormData.status || selectedMarketOppToEdit.fields?.['Status Negociação'] || 'Em Avaliação';
  const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Em Avaliação'];

  const isScoutPhase = currentStatus === 'Em Avaliação' || currentStatus.includes('Scouting');
  
  // CORREÇÃO: A Direção precisa de ver/escrever as notas a partir do momento em que o Scouting Aprova!
  const isDirectionPhase = currentStatus === 'Aprovado Scouting' || currentStatus.includes('Direção') || currentStatus === 'Em Negociação' || currentStatus === 'Fechado / Contratado';
  
  const isNegotiationPhase = currentStatus.includes('Negociação') || currentStatus.includes('Contratado');
  const isTerminal = currentStatus.includes('Vetado') || currentStatus === 'Negociação Cancelada' || currentStatus === 'Fechado / Contratado';

  const opportunityLogs = marketLogs.filter(log => {
    const oppIds = log.fields?.Oportunidade || [];
    return oppIds.includes(selectedMarketOppToEdit.id);
  });

  const handleActionSubmit = (newStatus: string, e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setDecisionFormData((prev: any) => ({ ...prev, status: newStatus }));
    onSubmit(e as React.FormEvent, newStatus);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${theme.card} border border-pink-500/30 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
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

        <form onSubmit={(e) => onSubmit(e)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* BANNER ESTÁTICO DE FASE ATUAL */}
          <div className={`${statusCfg.bg} border ${statusCfg.border} p-4 rounded-2xl flex items-center justify-between gap-3`}>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                Fase Atual do Processo
              </span>
              <h3 className={`text-sm font-bold ${statusCfg.color} flex items-center gap-2`}>
                {statusCfg.title}
              </h3>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowManualOverride(!showManualOverride)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {showManualOverride ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showManualOverride ? 'Ocultar Seleção' : 'Alterar Fase Manualmente'}
              </button>
            )}
          </div>

          {/* OVERRIDE MANUAL DE FASE (APENAS ADMIN) */}
          {showManualOverride && (
            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 animate-in fade-in duration-200">
              <label className="block text-[11px] font-bold text-amber-400 uppercase">Ajuste Direto de Fase (Modo Avançado)</label>
              <select
                value={currentStatus}
                onChange={(e) => setDecisionFormData({ ...decisionFormData, status: e.target.value })}
                className={`w-full border rounded-xl p-2.5 text-xs font-bold ${isDarkMode ? 'bg-[#0d131f] border-slate-700 text-white' : 'bg-white border-slate-300'}`}
              >
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* PARECER TÉCNICO SCOUTING */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Parecer Técnico do Scouting
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Pontos Fortes</label>
                <textarea
                  rows={2}
                  disabled={currentStatus !== 'Em Avaliação'}
                  value={(decisionFormData as any).strengths || ''}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, strengths: e.target.value } as any)}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-emerald-400' : 'bg-white border-slate-300'}`}
                  placeholder="Capacidades destacadas..."
                />
              </div>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Pontos Fracos</label>
                <textarea
                  rows={2}
                  disabled={currentStatus !== 'Em Avaliação'}
                  value={(decisionFormData as any).weaknesses || ''}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, weaknesses: e.target.value } as any)}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-red-400' : 'bg-white border-slate-300'}`}
                  placeholder="Debilidades e riscos..."
                />
              </div>
            </div>

            <div>
              <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Notas Globais / Justificação do Observador</label>
              <textarea
                rows={2}
                disabled={currentStatus !== 'Em Avaliação'}
                value={isScoutPhase ? decisionFormData.notesDD : (selectedMarketOppToEdit.fields?.['Notas Diretor Desportivo'] || '')}
                onChange={(e) => isScoutPhase && setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })}
                className={`w-full border rounded-xl p-2.5 text-xs resize-none disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                placeholder="Avaliação das qualidades e encaixe na equipa..."
              />
            </div>
          </div>

          {/* PARECER DA DIREÇÃO (Visível a partir de 'Aprovado Scouting') */}
          {isDirectionPhase && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Parecer da Presidência / Direção
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
            </div>
          )}

          {/* TERMOS DE NEGOCIAÇÃO */}
          {isNegotiationPhase && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Termos de Negociação
              </h4>
              <div>
                <label className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold mb-1`}>Notas de Proposta / Agente</label>
                <textarea
                  rows={2}
                  value={decisionFormData.notesDD}
                  onChange={(e) => setDecisionFormData({ ...decisionFormData, notesDD: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 text-xs resize-none ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`}
                  placeholder="Valores salariais, duração do contrato, prémio de assinatura..."
                />
              </div>
            </div>
          )}

          {/* MOTIVO DO VETO OU CANCELAMENTO */}
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

          {/* HISTÓRICO & AUDIT LOG */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-pink-400">
              <History className="w-4 h-4" /> Histórico de Alterações (Audit Log)
            </h4>

            {opportunityLogs.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {opportunityLogs.sort((a,b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()).map((log) => {
                  const lf = log.fields || {};
                  return (
                    <div key={log.id} className="p-3 bg-[#0d131f] border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{lf.Utilizador || 'Sistema'}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lf.Data_Hora || '-'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Mudou de <span className="text-slate-300 font-semibold">{lf.Status_Anterior || 'Início'}</span> para <span className="text-pink-400 font-bold">{lf.Status_Novo || lf.Status}</span>
                      </p>
                      {lf.Notas && <p className="text-[10px] text-slate-400 italic bg-slate-900/60 p-1.5 rounded border border-slate-800">{lf.Notas}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 border border-dashed rounded-xl text-center">
                Ainda sem histórico registado na tabela `Logs_Mercado`.
              </p>
            )}
          </div>

          {/* RODAPÉ E BOTÕES DE AÇÃO */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {currentStatus === 'Em Avaliação' && (
                <>
                  <button
                    type="button"
                    disabled={updatingDecision}
                    onClick={(e) => handleActionSubmit('Aprovado Scouting', e)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-900/20"
                  >
                    <ShieldCheck className="w-4 h-4" /> Aprovar Scout
                  </button>
                  <button
                    type="button"
                    disabled={updatingDecision}
                    onClick={(e) => handleActionSubmit('Vetado Scouting', e)}
                    className="flex-1 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-4 h-4" /> Vetar Scout
                  </button>
                </>
              )}

              {currentStatus === 'Aprovado Scouting' && (
                <>
                  {isManagement && (
                    <>
                      <button
                        type="button"
                        disabled={updatingDecision}
                        onClick={(e) => handleActionSubmit('Aprovado Direção', e)}
                        className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-purple-900/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Luz Verde Direção
                      </button>
                      <button
                        type="button"
                        disabled={updatingDecision}
                        onClick={(e) => handleActionSubmit('Vetado Direção', e)}
                        className="flex-1 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" /> Veto Direção
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={updatingDecision}
                    onClick={(e) => handleActionSubmit('Em Avaliação', e)}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Devolver a Avaliação
                  </button>
                </>
              )}

              {currentStatus === 'Aprovado Direção' && (
                <>
                  {isManagement && (
                    <button
                      type="button"
                      disabled={updatingDecision}
                      onClick={(e) => handleActionSubmit('Em Negociação', e)}
                      className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-900/20"
                    >
                      <Users className="w-4 h-4" /> Iniciar Negociação
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={updatingDecision}
                    onClick={(e) => handleActionSubmit('Aprovado Scouting', e)}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Devolver ao Scout
                  </button>
                </>
              )}

              {currentStatus === 'Em Negociação' && (
                <>
                  {isManagement && (
                    <>
                      <button
                        type="button"
                        disabled={updatingDecision}
                        onClick={(e) => handleActionSubmit('Fechado / Contratado', e)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-900/20"
                      >
                        <Trophy className="w-4 h-4" /> Assinar / Contratado
                      </button>
                      <button
                        type="button"
                        disabled={updatingDecision}
                        onClick={(e) => handleActionSubmit('Negociação Cancelada', e)}
                        className="flex-1 py-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <AlertTriangle className="w-4 h-4" /> Negócio Caiu
                      </button>
                    </>
                  )}
                </>
              )}

              {isTerminal && (
                <button
                  type="button"
                  disabled={updatingDecision}
                  onClick={(e) => handleActionSubmit('Em Avaliação', e)}
                  className="flex-1 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" /> Reabrir Processo (Em Avaliação)
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {isAdmin && onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(selectedMarketOppToEdit.id)}
                  className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl text-xs transition"
                  title="Eliminar permanentemente do Airtable"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : <div />}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updatingDecision}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-900/20 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  {updatingDecision ? 'A Guardar...' : 'Guardar Rascunho / Notas'}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}