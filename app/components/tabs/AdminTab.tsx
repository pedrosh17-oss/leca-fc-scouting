'use client';

import React from 'react';
import { Sliders, Upload, CheckSquare, Globe, Plus, X, Settings, CheckCircle2, Loader2 } from 'lucide-react';
import { Scout } from '../../types';

interface AdminTabProps {
  isAdmin: boolean;
  uniqueAlgoPlayersCount: number;
  uploadingExcel: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddMarket: (e: React.FormEvent) => void;
  newMarketInput: string;
  setNewMarketInput: (val: string) => void;
  adminMarkets: string[];
  handleRemoveMarket: (idx: number) => void;
  scouts: Scout[];
  isDarkMode: boolean;
}

export default function AdminTab({
  isAdmin, uniqueAlgoPlayersCount, uploadingExcel, handleFileUpload, handleAddMarket,
  newMarketInput, setNewMarketInput, adminMarkets, handleRemoveMarket, scouts, isDarkMode
}: AdminTabProps) {
  if (!isAdmin) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} border border-purple-500/30 p-6 md:p-8 rounded-2xl shadow-xl space-y-8`}>
        <div className={`flex items-center gap-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
          <div className="p-3 bg-purple-600/20 text-purple-500 rounded-xl border border-purple-500/30"><Sliders className="w-6 h-6"/></div>
          <div>
            <h2 className="text-xl font-bold">Painel do Head of Scouting (Administração)</h2>
            <p className={`text-xs ${themeTextMuted}`}>Carregar dados analíticos em bulk e gerir mercados do clube.</p>
          </div>
        </div>

        <div className={`${themeInnerCard} p-5 md:p-6 rounded-xl border border-purple-500/40 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-500" /> Upload de Métricas e Algoritmo (.XLSX)
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2.5 py-1 rounded border border-emerald-500/30">
              {uniqueAlgoPlayersCount} Atletas Únicos em Memória
            </span>
          </div>
          <p className={`text-xs ${themeTextMuted}`}>
            Selecione o ficheiro Excel com as métricas avançadas (Ratings, Pilares e Destaques). Se o ficheiro contiver a mesma pessoa em épocas/ligas diferentes, a app agrupa automaticamente o histórico sob a mesma ficha.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <label className="w-full sm:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/20 transition">
              {uploadingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploadingExcel ? 'A processar Excel...' : 'Carregar Ficheiro XLSX'}</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" disabled={uploadingExcel} />
            </label>
            <span className={`text-[11px] ${themeTextMuted}`}>
              Processamento 100% interno (via LocalForage - Persistente).
            </span>
          </div>
        </div>

        <div className={`${themeInnerCard} p-5 md:p-6 rounded-xl border space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-500" /> Missões & Tarefas Específicas
            </h3>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded border border-purple-500/30">Módulo em Estruturação</span>
          </div>
          <p className={`text-xs ${themeTextMuted}`}>Espaço reservado para envio de diretivas de observação individuais.</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" /> Mercados Alvo Globais do Leça FC
            </h3>
            <form onSubmit={handleAddMarket} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ex: América do Sul (Prospeção)..." 
                value={newMarketInput} 
                onChange={e => setNewMarketInput(e.target.value)} 
                className={`flex-1 border rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500 ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
              />
              <button type="submit" className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1">
                <Plus className="w-4 h-4"/> Adicionar
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {adminMarkets.map((m, idx) => (
                <div key={idx} className={`${themeInnerCard} p-3 rounded-xl border flex justify-between items-center text-xs font-medium`}>
                  <span>{m}</span>
                  <button onClick={() => handleRemoveMarket(idx)} className="text-slate-400 hover:text-red-400 transition p-1"><X className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-500" /> Parâmetros do Sistema
            </h3>
            
            <div className={`${themeInnerCard} p-4 rounded-xl border space-y-3 text-xs`}>
              <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-2`}>
                <span className={`${themeTextMuted} font-medium`}>Estado da Sincronização Airtable</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Ativa</span>
              </div>
              <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-2`}>
                <span className={`${themeTextMuted} font-medium`}>Total de Utilizadores Registados</span>
                <span className="font-bold">{scouts.length} Pessoas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${themeTextMuted} font-medium`}>Versão da Intranet</span>
                <span className="text-purple-500 font-bold">Leça FC Scouting v3.0 (Modular)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}