'use client';

import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';
import { Player } from '../../../types';

interface ProfileReportsTabProps {
  selectedPlayer: Player;
  renderFormattedMarkdown: (text: string) => React.ReactNode;
  isDarkMode: boolean;
}

export default function ProfileReportsTab({
  selectedPlayer,
  renderFormattedMarkdown,
  isDarkMode
}: ProfileReportsTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';

  const rep = selectedPlayer.finalReport;
  const reportText = typeof rep === 'string' ? rep : '';
  const isValid = reportText && reportText !== 'N/D' && reportText !== 'Sem observações registadas.' && reportText !== '[object Object]';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={`${themeCard} p-6 md:p-8 rounded-2xl border border-blue-500/30 shadow-xl space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wider">
                Relatório Consolidado de Prospeção
              </h3>
            </div>
          </div>
        </div>

        {isValid ? (
          <div className={`${themeInnerCard} p-5 md:p-6 rounded-xl border border-slate-700/40 text-xs md:text-sm`}>
            {renderFormattedMarkdown(reportText)}
          </div>
        ) : (
          <div className={`text-center py-12 ${themeInnerCard} rounded-xl border border-dashed text-xs md:text-sm space-y-2`}>
            <Info className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="font-bold text-slate-400">Sem report</p>
          </div>
        )}
      </div>
    </div>
  );
}