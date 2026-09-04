'use client';

import React from 'react';
import { Briefcase, X, UserCheck, Globe, Target, Loader2 } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { MarketFormData, Player, Team, Scout } from '../../types';
import { POSITIONS_OPTIONS, MARKET_TARGET_OPTIONS } from '../../constants/options';

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketFormData: MarketFormData;
  setMarketFormData: React.Dispatch<React.SetStateAction<MarketFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submittingMarket: boolean;
  players: Player[];
  teams: Team[];
  displayScouts: Scout[];
  isDarkMode: boolean;
}

export default function MarketModal({
  isOpen,
  onClose,
  marketFormData,
  setMarketFormData,
  onSubmit,
  submittingMarket,
  players,
  teams,
  displayScouts,
  isDarkMode
}: MarketModalProps) {
  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  // Lógica corrigida: ao selecionar na dropdown, preenchemos o formulário automaticamente
  const handleSelectExistingPlayer = (playerId: string) => {
    const p = players.find(player => player.id === playerId);
    if (p) {
      setMarketFormData(prev => ({
        ...prev,
        playerId: p.id,
        name: p.name,
        club: p.club || '',
        position: p.position || '',
        foot: p.foot || '',
        birthDate: p.birthDate || ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border border-pink-500/30 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]`}>
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 border border-pink-500/30 text-pink-500 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Oportunidade de Mercado</h2>
              <p className={`text-xs ${themeTextMuted}`}>Registar novo alvo referenciado no Airtable.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* BLOCO 1: IDENTIFICAÇÃO DO ATLETA */}
          <div className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4"/> Dados do Atleta
              </h3>
              {marketFormData.playerId && (
                <button
                  type="button"
                  onClick={() => setMarketFormData({ ...marketFormData, playerId: '', name: '', club: '', position: '', foot: '', birthDate: '' })}
                  className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-bold self-start sm:self-auto"
                >
                  Limpar Seleção (Atleta Novo)
                </button>
              )}
            </div>

            <div>
              <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Procurar na Base de Dados (Atleta Existente)</label>
              <CustomSelect
                options={players.map((p) => ({ value: p.id, label: `${p.name} (${p.club || 'S/ Clube'})`, image: p.photo }))}
                value={marketFormData.playerId}
                onChange={handleSelectExistingPlayer}
                placeholder="Pesquisar atleta na BD do Leça..."
                searchable={true}
                isDarkMode={isDarkMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Nome Completo *</label>
                <input 
                  type="text" required 
                  value={marketFormData.name} 
                  onChange={e => setMarketFormData({...marketFormData, name: e.target.value, playerId: ''})} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                  placeholder="Ex: João Silva" 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Clube Atual *</label>
                <CustomSelect 
                  options={teams.map((t) => ({ value: t.name, label: t.name }))} 
                  value={marketFormData.club} 
                  onChange={v => setMarketFormData({...marketFormData, club: v})} 
                  placeholder="Selecione o clube..." 
                  searchable={true} 
                  isDarkMode={isDarkMode} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Data da Oferta / Entrada *</label>
                <input 
                  type="date" required 
                  value={marketFormData.offerDate} 
                  onChange={e => setMarketFormData({...marketFormData, offerDate: e.target.value})} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Data de Nascimento</label>
                <input 
                  type="date"
                  value={marketFormData.birthDate} 
                  onChange={e => setMarketFormData({...marketFormData, birthDate: e.target.value})} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Posição *</label>
                <CustomSelect 
                  options={POSITIONS_OPTIONS.map((p) => ({value: p, label: p}))} 
                  value={marketFormData.position} 
                  onChange={v => setMarketFormData({...marketFormData, position: v})} 
                  placeholder="Selecione..." 
                  isDarkMode={isDarkMode} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Pé Preferencial</label>
                <CustomSelect 
                  options={[{value:'Direito', label:'Direito'}, {value:'Esquerdo', label:'Esquerdo'}, {value:'Ambos', label:'Ambos'}]} 
                  value={marketFormData.foot} 
                  onChange={v => setMarketFormData({...marketFormData, foot: v})} 
                  placeholder="Selecione..." 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>
          </div>

          {/* BLOCO 2: CONTEXTO DE NEGÓCIO */}
          <div className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4"/> Contexto de Negócio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Mercado Target *</label>
                <CustomSelect 
                  options={MARKET_TARGET_OPTIONS} 
                  value={marketFormData.marketTarget} 
                  onChange={v => setMarketFormData({...marketFormData, marketTarget: v})} 
                  placeholder="Qual a janela?" 
                  isDarkMode={isDarkMode} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Scout / Observador *</label>
                <CustomSelect options={displayScouts.map((s) => ({value: s.name, label: s.name}))} value={marketFormData.scout} onChange={v => setMarketFormData({...marketFormData, scout: v})} placeholder="Quem referenciou?" isDarkMode={isDarkMode} />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Situação Contratual</label>
                <CustomSelect options={[{value:'Livre / Sem contrato', label:'Livre / Sem contrato'}, {value:'Fim de contrato', label:'Fim de contrato'}, {value:'Sob contrato (Empréstimo)', label:'Sob contrato (Empréstimo)'}, {value:'Sob contrato (Transferência)', label:'Sob contrato (Transferência)'}]} value={marketFormData.contract} onChange={v => setMarketFormData({...marketFormData, contract: v})} placeholder="Contrato..." isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>

          {/* BLOCO 3: ANÁLISE & CONFIANÇA */}
          <div className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Target className="w-4 h-4"/> Análise & Confiança
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-[10px] font-bold mb-1.5 uppercase`}>Confiança Liga 3</label>
                <CustomSelect options={[{value:'1', label:'1 - Fraca'}, {value:'2', label:'2 - Média'}, {value:'3', label:'3 - Alta'}]} value={marketFormData.confLiga3} onChange={v => setMarketFormData({...marketFormData, confLiga3: v})} placeholder="-" isDarkMode={isDarkMode} />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-[10px] font-bold mb-1.5 uppercase`}>Confiança Liga 2</label>
                <CustomSelect options={[{value:'1', label:'1 - Fraca'}, {value:'2', label:'2 - Média'}, {value:'3', label:'3 - Alta'}]} value={marketFormData.confLiga2} onChange={v => setMarketFormData({...marketFormData, confLiga2: v})} placeholder="-" isDarkMode={isDarkMode} />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-[10px] font-bold mb-1.5 uppercase`}>Viabilidade Financeira</label>
                <CustomSelect options={[{value:'1 - Caro', label:'1 - Fora do Teto / Caro'}, {value:'2 - Possível', label:'2 - Exige Esforço'}, {value:'3 - Acessível', label:'3 - Totalmente Acessível'}]} value={marketFormData.viability} onChange={v => setMarketFormData({...marketFormData, viability: v})} placeholder="-" isDarkMode={isDarkMode} />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-[10px] font-bold mb-1.5 uppercase`}>Utilização Prevista</label>
                <CustomSelect options={[{value:'Titular Absoluto', label:'Titular Absoluto'}, {value:'Rotação Constante', label:'Rotação Constante'}, {value:'Compositor de Plantel', label:'Compositor de Plantel'}, {value:'Aposta de Futuro', label:'Aposta de Futuro'}]} value={marketFormData.utilization} onChange={v => setMarketFormData({...marketFormData, utilization: v})} placeholder="-" isDarkMode={isDarkMode} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Pontos Fortes</label>
                <textarea rows={3} value={marketFormData.strengths} onChange={e => setMarketFormData({...marketFormData, strengths: e.target.value})} className={`w-full border rounded-xl p-3 text-sm resize-none focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Pontos Fracos</label>
                <textarea rows={3} value={marketFormData.weaknesses} onChange={e => setMarketFormData({...marketFormData, weaknesses: e.target.value})} className={`w-full border rounded-xl p-3 text-sm resize-none focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>

            <div>
              <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Motivo da Contratação</label>
              <textarea rows={2} value={marketFormData.reason} onChange={e => setMarketFormData({...marketFormData, reason: e.target.value})} className={`w-full border rounded-xl p-3 text-sm resize-none focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} placeholder="O que acrescenta ao plantel?" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button type="submit" disabled={submittingMarket} className="flex-1 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition">
              {submittingMarket ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registar Oportunidade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}