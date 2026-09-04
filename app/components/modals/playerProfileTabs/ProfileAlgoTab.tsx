'use client';

import React from 'react';
import { Calendar, Info, Clock, Cpu, Award, Star, BarChart3 } from 'lucide-react';

interface ProfileAlgoTabProps {
  sortedEntry: any[];
  selectedSeasonIdx: number;
  setSelectedSeasonIdx: (idx: number) => void;
  playerAlgo: any;
  isGK: boolean;
  pillarList: Array<{ title: string; key: string }>;
  setSelectedPillarDetail: (pillar: string | null) => void;
  isDarkMode: boolean;
}

export default function ProfileAlgoTab({
  sortedEntry,
  selectedSeasonIdx,
  setSelectedSeasonIdx,
  playerAlgo,
  isGK,
  pillarList,
  setSelectedPillarDetail,
  isDarkMode
}: ProfileAlgoTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  if (!sortedEntry.length || !playerAlgo) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${themeCard} rounded-2xl border border-dashed text-center px-4`}>
        <BarChart3 className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-bold mb-2">Sem Dados de Ratings Registados</h3>
        <p className={`text-sm ${themeTextMuted} max-w-md`}>
          Este atleta ainda não foi associado a um ficheiro de métricas. Faça o upload do ficheiro Excel no <strong>Painel Admin</strong> para carregar os ratings.
        </p>
      </div>
    );
  }

  const activeItem = sortedEntry[selectedSeasonIdx] || sortedEntry[0];
  const notaValRaw = playerAlgo.Top_Profile_1_Score || playerAlgo.Nota_Melhor_Perfil;
  const notaVal = notaValRaw ? parseFloat(notaValRaw) : null;
  const notaMedianRaw = playerAlgo.Top_Profile_1_Score_Median_Liga || playerAlgo.Nota_Melhor_Perfil_Median_Liga || playerAlgo.Top_Profile_1_Score_Median || playerAlgo.Nota_Melhor_Perfil_Median;
  const notaMedian = notaMedianRaw ? parseFloat(notaMedianRaw) : null;
  const notaDelta = (notaVal !== null && notaMedian !== null) ? (notaVal - notaMedian) : null;

  const top5Attrs = [];
  for (let i = 1; i <= 5; i++) {
    const name = playerAlgo[`Top_Attr_${i}_Name`];
    const val = playerAlgo[`Top_Attr_${i}_Val`];
    if (name) top5Attrs.push({ name, val });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-3.5 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
            <Calendar className="w-4 h-4 text-cyan-400" /> Contexto:
          </span>
          <div className="flex gap-2">
            {sortedEntry.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSeasonIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  selectedSeasonIdx === idx
                    ? 'bg-cyan-600 text-white shadow-md'
                    : `${themeInnerCard} border text-slate-400 hover:text-slate-200`
                }`}
              >
                {item.tag}
              </button>
            ))}
          </div>
        </div>
        <div title="Registo exato mapeado no ficheiro Excel" className="text-[10px] text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/50 font-mono opacity-60 hover:opacity-100 transition cursor-help flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0">
          <Info className="w-3 h-3 text-cyan-400" />
          <span className="truncate max-w-[200px] md:max-w-[280px]">{playerAlgo.Player_ID || playerAlgo.Player || 'Sem ID'}</span>
        </div>
      </div>

      <div className={`${themeCard} p-4 rounded-2xl border grid grid-cols-2 gap-3 text-center`}>
        <div className={`${themeInnerCard} p-3.5 rounded-xl border`}>
          <span className={`text-[10px] ${themeTextMuted} uppercase font-bold block mb-0.5`}>Jogos Disputados</span>
          <span className="text-xl font-black text-emerald-500">{playerAlgo['Matches played'] || '--'}</span>
        </div>
        <div className={`${themeInnerCard} p-3.5 rounded-xl border`}>
          <span className={`text-[10px] ${themeTextMuted} uppercase font-bold block mb-0.5 flex items-center justify-center gap-1`}>
            <Clock className="w-3 h-3 text-blue-500"/> Minutos Jogados
          </span>
          <span className="text-xl font-black text-blue-500">{playerAlgo['Minutes'] ? `${playerAlgo['Minutes']}'` : '--'}</span>
        </div>
      </div>

      <div className={`${themeCard} p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1 justify-center md:justify-start">
            <Cpu className="w-3.5 h-3.5" /> Perfil Principal {activeItem?.tag ? `(${activeItem.tag})` : ''}
          </span>
          <h3 className="text-2xl font-black">{playerAlgo.Top_Profile_1_Name || playerAlgo.Melhor_Perfil || 'N/D'}</h3>
          <p className={`text-xs ${themeTextMuted}`}>
            Tier: <span className="text-cyan-400 font-bold">{playerAlgo.Scout_Tier || 'N/D'}</span>
          </p>
        </div>
        
        <div className="bg-cyan-950/30 px-6 py-3.5 rounded-xl border border-cyan-500/30 text-center min-w-[120px] flex flex-col items-center">
          <span className="block text-[10px] text-cyan-400 uppercase font-bold">Nota</span>
          <span className="text-3xl font-black text-cyan-400">{notaVal !== null ? notaVal.toFixed(1) : '0'}</span>
          {notaDelta !== null && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1.5 ${notaDelta >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {notaDelta >= 0 ? `+${notaDelta.toFixed(1)}` : notaDelta.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className={`${themeCard} p-6 rounded-2xl border space-y-4`}>
        <div className="flex justify-between items-center">
          <h4 className={`text-xs font-bold ${themeTextMuted} uppercase tracking-wider flex items-center gap-2`}>
            <Award className="w-4 h-4 text-blue-500"/> Pilares de Desempenho
          </h4>
          <span className={`text-[10px] ${themeTextMuted} font-medium`}>Clica num pilar para ver os detalhes</span>
        </div>

        <div className={`grid grid-cols-2 ${isGK ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-3`}>
          {pillarList.map((pilar, idx) => {
            const val = playerAlgo[pilar.key];
            const numVal = val ? parseFloat(val) : 0;
            const medianLiga = playerAlgo[`${pilar.title}_Median_Liga`];
            const numMedian = medianLiga ? parseFloat(medianLiga) : null;
            const delta = numMedian !== null ? numVal - numMedian : null;

            return (
              <button 
                key={idx} 
                onClick={() => setSelectedPillarDetail(pilar.title)}
                className={`${themeInnerCard} p-3.5 rounded-xl border hover:border-cyan-500/50 transition text-left group flex flex-col justify-between`}
              >
                <span className={`block text-[10px] ${themeTextMuted} font-bold mb-1 group-hover:text-cyan-400 transition`}>{pilar.title}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold">{val ? numVal.toFixed(1) : '--'}</span>
                  {delta !== null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${delta >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {top5Attrs.length > 0 && (
        <div className={`${themeInnerCard} p-4 md:p-5 rounded-2xl border space-y-3`}>
          <h4 className={`text-xs font-bold ${themeTextMuted} uppercase tracking-wider flex items-center gap-2`}>
            <Star className="w-4 h-4 text-amber-500"/> Top 5 Atributos em Destaque
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {top5Attrs.map((attr, i) => {
              const numVal = attr.val !== undefined && attr.val !== null ? parseFloat(attr.val) : null;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm`}>
                  <span className="text-xs font-bold truncate pr-2">{attr.name}</span>
                  {numVal !== null && (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono flex-shrink-0">
                      {numVal.toFixed(1)} Pct
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}