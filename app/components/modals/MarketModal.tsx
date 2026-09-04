'use client';

import React, { useState } from 'react';
import { Briefcase, X, UserCheck, Globe, Loader2, UserPlus, RefreshCcw } from 'lucide-react';
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
  const [isCreatingNewPlayer, setIsCreatingNewPlayer] = useState(false);

  if (!isOpen) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const handleSelectExistingPlayer = (playerId: string) => {
    setIsCreatingNewPlayer(false);
    const p = players.find(player => player.id === playerId);
    if (p) {
      let mappedFoot = p.foot || '';
      if (mappedFoot === 'D') mappedFoot = 'Direito';
      else if (mappedFoot === 'E') mappedFoot = 'Esquerdo';
      else if (mappedFoot === 'Ambi') mappedFoot = 'Ambos';

      setMarketFormData(prev => ({
        ...prev,
        playerId: p.id,
        name: p.name,
        club: p.club || '',
        position: p.position || '',
        foot: mappedFoot,
        birthDate: p.birthDate || '',
        nationality: p.nationality || ''
      }));
    }
  };

  const handleEnableNewPlayerMode = () => {
    setIsCreatingNewPlayer(true);
    setMarketFormData(prev => ({
      ...prev,
      playerId: '',
      name: '',
      club: '',
      position: '',
      foot: '',
      birthDate: '',
      nationality: ''
    }));
  };

  const handleClearSelection = () => {
    setIsCreatingNewPlayer(false);
    setMarketFormData(prev => ({
      ...prev,
      playerId: '',
      name: '',
      club: '',
      position: '',
      foot: '',
      birthDate: '',
      nationality: ''
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border border-pink-500/30 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]`}>
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 border border-pink-500/30 text-pink-500 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Registar Entrada / Oferta de Mercado</h2>
              <p className={`text-xs ${themeTextMuted}`}>Introduzir atleta referenciado para iniciar o processo de avaliação.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* BLOCO 1: DADOS DO ATLETA */}
          <div className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4"/> Dados do Atleta
              </h3>
              
              <div className="flex items-center gap-2">
                {!isCreatingNewPlayer ? (
                  <>
                    {marketFormData.playerId && (
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="text-[10px] text-slate-400 bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1 transition"
                      >
                        <RefreshCcw className="w-3 h-3" /> Limpar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleEnableNewPlayerMode}
                      className="text-xs text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-xl border border-pink-500/30 font-bold flex items-center gap-1.5 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> + Criar Atleta Novo
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 font-bold"
                  >
                    Procurar Existente na BD
                  </button>
                )}
              </div>
            </div>

            {!isCreatingNewPlayer && (
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Procurar na Base de Dados do Leça</label>
                <CustomSelect
                  options={players.map((p) => ({ value: p.id, label: `${p.name} (${p.club || 'S/ Clube'})`, image: p.photo }))}
                  value={marketFormData.playerId}
                  onChange={handleSelectExistingPlayer}
                  placeholder="Pesquisar atleta na BD..."
                  searchable={true}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {isCreatingNewPlayer && (
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-xs text-pink-300 font-semibold">
                ✨ Modo de Atleta Novo ativo: ao submeter, este jogador será automaticamente adicionado à BD de Jogadores.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Nome Completo *</label>
                <input 
                  type="text" required 
                  disabled={!isCreatingNewPlayer && !!marketFormData.playerId}
                  value={marketFormData.name} 
                  onChange={e => setMarketFormData({...marketFormData, name: e.target.value})} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                  placeholder="Ex: João Silva" 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Clube Atual *</label>
                {isCreatingNewPlayer ? (
                  <CustomSelect 
                    options={teams.map((t) => ({ value: t.name, label: t.name }))} 
                    value={marketFormData.club} 
                    onChange={v => setMarketFormData({...marketFormData, club: v})} 
                    placeholder="Selecione o clube..." 
                    searchable={true} 
                    isDarkMode={isDarkMode} 
                  />
                ) : (
                  <input 
                    type="text" disabled 
                    value={marketFormData.club} 
                    className={`w-full border rounded-xl p-3 text-sm disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300'}`} 
                  />
                )}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Data de Nascimento</label>
                <input 
                  type="date"
                  disabled={!isCreatingNewPlayer && !!marketFormData.playerId}
                  value={marketFormData.birthDate} 
                  onChange={e => setMarketFormData({...marketFormData, birthDate: e.target.value})} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Nacionalidade</label>
                <input 
                  type="text"
                  disabled={!isCreatingNewPlayer && !!marketFormData.playerId}
                  value={(marketFormData as any).nationality || ''} 
                  onChange={e => setMarketFormData({...marketFormData, nationality: e.target.value } as any)} 
                  className={`w-full border rounded-xl p-3 text-sm focus:border-pink-500 disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                  placeholder="Ex: Portugal" 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Posição *</label>
                {isCreatingNewPlayer ? (
                  <CustomSelect 
                    options={POSITIONS_OPTIONS.map((p) => ({value: p, label: p}))} 
                    value={marketFormData.position} 
                    onChange={v => setMarketFormData({...marketFormData, position: v})} 
                    placeholder="Selecione..." 
                    isDarkMode={isDarkMode} 
                  />
                ) : (
                  <input 
                    type="text" disabled 
                    value={marketFormData.position} 
                    className={`w-full border rounded-xl p-3 text-sm disabled:opacity-60 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300'}`} 
                  />
                )}
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

          {/* BLOCO 2: CONTEXTO DO NEGÓCIO */}
          <div className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4"/> Contexto do Negócio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Oferecido a: *</label>
                <CustomSelect 
                  options={displayScouts.map((s) => ({value: s.name, label: s.name}))} 
                  value={marketFormData.scout} 
                  onChange={v => setMarketFormData({...marketFormData, scout: v})} 
                  placeholder="Quem recebeu a indicação?" 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Situação Contratual</label>
                <CustomSelect 
                  options={[
                    {value:'Livre / Sem contrato', label:'Livre / Sem contrato'}, 
                    {value:'Fim de contrato', label:'Fim de contrato'}, 
                    {value:'Sob contrato (Empréstimo)', label:'Sob contrato (Empréstimo)'}, 
                    {value:'Sob contrato (Transferência)', label:'Sob contrato (Transferência)'}
                  ]} 
                  value={marketFormData.contract} 
                  onChange={v => setMarketFormData({...marketFormData, contract: v})} 
                  placeholder="Contrato..." 
                  isDarkMode={isDarkMode} 
                />
              </div>
              <div>
                <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Viabilidade Financeira</label>
                <CustomSelect 
                  options={[
                    { value: '1 - Fora do Teto / Caro', label: '1 - Fora do Teto / Caro' },
                    { value: '2 - Dentro do Teto', label: '2 - Dentro do Teto' },
                    { value: '3 - Oportunidade / Acessível', label: '3 - Oportunidade / Acessível' }
                  ]} 
                  value={marketFormData.viability} 
                  onChange={v => setMarketFormData({...marketFormData, viability: v})} 
                  placeholder="Selecione enquadramento..." 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>

            <div>
              <label className={`block ${themeTextMuted} text-xs font-bold mb-1.5`}>Notas do Agente / Contexto da Oferta</label>
              <textarea 
                rows={2} 
                value={marketFormData.reason} 
                onChange={e => setMarketFormData({...marketFormData, reason: e.target.value})} 
                className={`w-full border rounded-xl p-3 text-sm resize-none focus:border-pink-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-white' : 'bg-white border-slate-300'}`} 
                placeholder="Ex: Proposto pelo agente X com passe livre no Verão..." 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button type="submit" disabled={submittingMarket} className="flex-1 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition">
              {submittingMarket ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registar Entrada no Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}