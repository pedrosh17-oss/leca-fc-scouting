'use client';

import React from 'react';
import { Calendar, UserCheck, ExternalLink, FileText } from 'lucide-react';

interface ProfileTimelineTabProps {
  timelineReports: any[];
  onClose: () => void;
  navigateToMatch: (matchId: string) => void;
  isDarkMode: boolean;
}

export default function ProfileTimelineTab({
  timelineReports,
  onClose,
  navigateToMatch,
  isDarkMode
}: ProfileTimelineTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      {timelineReports.length > 0 ? (
        <div className={`relative border-l-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-300'} ml-3 md:ml-4 space-y-8 pb-4`}>
          {timelineReports.map((report, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full left-[-9px] top-1 border-4 border-slate-900 shadow-sm"></div>
              <div className={`${themeCard} p-4 md:p-5 rounded-2xl border shadow-sm`}>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                  <div>
                    <h4 className="font-bold text-sm md:text-base leading-tight">{report.matchName}</h4>
                    <div className={`flex items-center gap-2 text-[10px] md:text-xs ${themeTextMuted} mt-1`}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {report.gameDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] md:text-xs font-medium ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                      <UserCheck className="w-3 h-3 text-blue-500"/> Scout: {report.scout}
                    </div>
                    <button onClick={() => { onClose(); navigateToMatch(report.matchId); }} className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-500 text-[10px] md:text-xs font-bold rounded-lg transition flex items-center gap-1.5">
                      Ir para Jogo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs md:text-sm leading-relaxed font-sans whitespace-pre-wrap">{report.note}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${themeCard} rounded-2xl border border-dashed`}>
          <FileText className="w-8 h-8 mx-auto text-slate-400 mb-3" />
          <p className="text-sm font-medium">Ainda não existem observações de jogo para este atleta.</p>
          <p className={`text-xs ${themeTextMuted} mt-1`}>As avaliações individuais feitas no Match Center aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
}