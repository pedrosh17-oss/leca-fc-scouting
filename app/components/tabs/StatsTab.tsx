'use client';

import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import RadarChart from '../RadarChart';

interface StatsTabProps {
  comparePlayerKeyA: string;
  setComparePlayerKeyA: (val: string) => void;
  comparePlayerKeyB: string;
  setComparePlayerKeyB: (val: string) => void;
  comparePlayerKeyC: string;
  setComparePlayerKeyC: (val: string) => void;
  algoOptions: Array<{ value: string; label: string }>;
  algorithmData: Record<string, any[]>;
  extractContextTag: (row: any) => string;
  isDarkMode: boolean;
}

export default function StatsTab({
  comparePlayerKeyA, setComparePlayerKeyA, comparePlayerKeyB, setComparePlayerKeyB, comparePlayerKeyC, setComparePlayerKeyC,
  algoOptions, algorithmData, extractContextTag, isDarkMode
}: StatsTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const getRowFromOptionValue = (optValue: string) => {
    if (!optValue) return null;
    const parts = optValue.split('___');
    const key = parts[0];
    const idx = Number(parts[1]);
    if (key && algorithmData[key] && algorithmData[key][idx]) return algorithmData[key][idx].row;
    return null;
  };

  const rowA = getRowFromOptionValue(comparePlayerKeyA);
  const rowB = getRowFromOptionValue(comparePlayerKeyB);
  const rowC = getRowFromOptionValue(comparePlayerKeyC);

  const cleanName = (name: string) => name.replace(/\s*\([^)]*\)/g, '').trim();
  const nameA = rowA?.Player || rowA?.Player_ID || 'Jogador A';
  const nameB = rowB?.Player || rowB?.Player_ID || 'Jogador B';
  const nameC = rowC?.Player || rowC?.Player_ID || 'Jogador C';

  const tagA = rowA ? extractContextTag(rowA) : '';
  const tagB = rowB ? extractContextTag(rowB) : '';
  const tagC = rowC ? extractContextTag(rowC) : '';

  const cardLabelA = rowA ? `${cleanName(nameA)}${tagA ? ` (${tagA})` : ''}` : '';
  const cardLabelB = rowB ? `${cleanName(nameB)}${tagB ? ` (${tagB})` : ''}` : '';
  const cardLabelC = rowC ? `${cleanName(nameC)}${tagC ? ` (${tagC})` : ''}` : '';

  const pillars = [
    { axis: 'Defesa', key: 'Defesa' }, { axis: 'Jogo Aéreo', key: 'Jogo Aéreo' },
    { axis: 'Construção', key: 'Construção' }, { axis: 'Criação', key: 'Criação' },
    { axis: 'Cruzamento', key: 'Cruzamento' }, { axis: '1v1', key: 'Capacidade 1v1' },
    { axis: 'Profundidade', key: 'Profundidade' }, { axis: 'Finalização', key: 'Finalização' },
  ];

  const chartData = pillars.map(p => ({
    axis: p.axis,
    A: rowA && rowA[p.key] ? parseFloat(rowA[p.key]) || 0 : 0,
    B: rowB && rowB[p.key] ? parseFloat(rowB[p.key]) || 0 : 0,
    C: rowC && rowC[p.key] ? parseFloat(rowC[p.key]) || 0 : 0,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-6 rounded-2xl border border-blue-500/30 shadow-xl space-y-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-700/40 pb-4 gap-4">
          <div>
            <h2 className="text-base md:text-lg font-bold uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Comparador Head-to-Head (H2H)
            </h2>
            <p className={`text-xs ${themeTextMuted} mt-0.5`}>Compara até 3 atletas nos 8 pilares de desempenho principais.</p>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-400 font-bold px-3 py-1.5 rounded-xl border border-blue-500/30">
            {algoOptions.length} Opções Disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Jogador A</label>
            <CustomSelect options={algoOptions} value={comparePlayerKeyA} onChange={setComparePlayerKeyA} placeholder="Procurar A..." searchable={true} isDarkMode={isDarkMode} />
          </div>
          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Jogador B</label>
            <CustomSelect options={algoOptions} value={comparePlayerKeyB} onChange={setComparePlayerKeyB} placeholder="Procurar B..." searchable={true} isDarkMode={isDarkMode} />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Jogador C</label>
            <CustomSelect options={algoOptions} value={comparePlayerKeyC} onChange={setComparePlayerKeyC} placeholder="Procurar C..." searchable={true} isDarkMode={isDarkMode} />
          </div>
        </div>

        {comparePlayerKeyA || comparePlayerKeyB || comparePlayerKeyC ? (
          <div className="pt-4">
            <div className={`${themeInnerCard} p-6 rounded-2xl border flex flex-col items-center justify-center min-h-[380px]`}>
              <RadarChart playerAName={rowA ? cleanName(nameA) : ''} playerBName={rowB ? cleanName(nameB) : undefined} playerCName={rowC ? cleanName(nameC) : undefined} colorA="#3b82f6" colorB="#ec4899" colorC="#10b981" data={chartData} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {pillars.map((p) => {
                const valA = rowA && rowA[p.key] ? parseFloat(rowA[p.key]) : null;
                const valB = rowB && rowB[p.key] ? parseFloat(rowB[p.key]) : null;
                const valC = rowC && rowC[p.key] ? parseFloat(rowC[p.key]) : null;
                const maxVal = Math.max(...[valA, valB, valC].filter(v => v !== null) as number[]);

                return (
                  <div key={p.key} className={`${themeInnerCard} p-3.5 rounded-xl border flex flex-col space-y-2.5 hover:border-slate-600 transition`}>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-700/50 pb-2">{p.axis}</span>
                    {[ {v: valA, l: cardLabelA, c: 'bg-blue-500'}, {v: valB, l: cardLabelB, c: 'bg-pink-500'}, {v: valC, l: cardLabelC, c: 'bg-emerald-500'} ].map((item, i) => item.v !== null && (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-hidden pr-2">
                          <span className={`w-2 h-2 rounded-full ${item.c} flex-shrink-0`}/>
                          <span className="text-[10px] md:text-xs truncate text-slate-300" title={item.l}>{item.l}</span>
                        </div>
                        <span className={`text-xs ${item.v === maxVal && item.v !== null ? 'font-black text-white bg-slate-800 px-1.5 rounded' : 'font-semibold text-slate-400'}`}>{item.v?.toFixed(1) || '-'}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={`text-center py-16 ${themeInnerCard} rounded-2xl border border-dashed text-xs md:text-sm space-y-2`}>
            <Info className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="font-bold text-slate-300">Nenhum atleta selecionado</p>
            <p className={`${themeTextMuted} text-xs`}>Escolha pelo menos um atleta nos seletores acima para gerar o gráfico radar e a grelha de pontuações.</p>
          </div>
        )}
      </div>
    </div>
  );
}