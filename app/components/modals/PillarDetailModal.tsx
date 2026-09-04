'use client';

import React from 'react';
import { Info, X } from 'lucide-react';
import { Player } from '../../types';
import { PILLAR_METRICS_MAP } from '../../constants/options';

interface PillarDetailModalProps {
  selectedPillarDetail: string | null;
  selectedPlayer: Player | null;
  onClose: () => void;
  selectedSeasonIdx: number;
  algorithmData: Record<string, any[]>;
  getPlayerAlgoEntries: (player: any, algoData: any) => any[];
  isDarkMode: boolean;
}

export default function PillarDetailModal({
  selectedPillarDetail,
  selectedPlayer,
  onClose,
  selectedSeasonIdx,
  algorithmData,
  getPlayerAlgoEntries,
  isDarkMode
}: PillarDetailModalProps) {
  if (!selectedPillarDetail || !selectedPlayer) return null;

  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const rawEntry = getPlayerAlgoEntries(selectedPlayer, algorithmData);
  const safeArray = Array.isArray(rawEntry) ? rawEntry : (rawEntry && typeof rawEntry === 'object' && Object.keys(rawEntry).length > 0 ? [{ tag: 'Atual', row: rawEntry }] : []);

  const sortedEntry = [...safeArray].sort((a, b) => {
    if (a.tag === 'Atual') return -1;
    if (b.tag === 'Atual') return 1;
    return (b.tag || '').localeCompare(a.tag || '');
  });

  const activeItem = sortedEntry[selectedSeasonIdx] || sortedEntry[0];
  const playerAlgo = activeItem?.row;
  const metrics = PILLAR_METRICS_MAP[selectedPillarDetail] || [];
  
  const pillarScoreRaw = playerAlgo ? playerAlgo[selectedPillarDetail] : null;
  const pillarScore = pillarScoreRaw ? parseFloat(pillarScoreRaw).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${themeCard} border border-blue-500/40 w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 space-y-5 animate-in fade-in zoom-in-95`}>
        <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg border border-blue-500/30">
              <Info className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="font-bold text-base">
                {selectedPillarDetail} {pillarScore && <span className="text-blue-500 ml-1.5">({pillarScore})</span>}
              </h3>
              <p className={`text-xs ${themeTextMuted}`}>{selectedPlayer.name} {activeItem?.tag ? `(${activeItem.tag})` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white transition`}>
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="space-y-3">
          {metrics.map((m, idx) => {
            const rawVal = playerAlgo ? playerAlgo[m.statKey] : null;
            const pctVal = playerAlgo ? playerAlgo[m.pctKey] : null;
            
            const numPct = parseFloat(pctVal);
            let pctColor = "text-emerald-500";
            if (isNaN(numPct)) pctColor = "text-slate-400";
            else if (numPct < 33) pctColor = "text-red-500";
            else if (numPct < 66) pctColor = "text-amber-500";

            return (
              <div key={idx} className={`${themeInnerCard} p-3.5 rounded-xl border flex items-center justify-between`}>
                <div>
                  <span className="block text-xs font-bold mb-0.5">{m.label}</span>
                  <div className={`flex items-center gap-3 text-[11px] ${themeTextMuted}`}>
                    <span>Bruto: <strong className="font-bold">{rawVal !== undefined && rawVal !== null ? parseFloat(rawVal).toFixed(2) : 'N/D'}</strong></span>
                    <span>•</span>
                    <span>Percentil: <strong className={`${pctColor} font-bold`}>{pctVal !== undefined && pctVal !== null ? `${numPct.toFixed(1)} Pct` : 'N/D'}</strong></span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">Peso: {m.weight}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className={`px-5 py-2.5 ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'} font-bold rounded-xl text-xs`}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}