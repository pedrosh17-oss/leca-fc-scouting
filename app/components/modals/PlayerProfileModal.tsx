'use client';

import React from 'react';
import { 
  X, Activity, Shield, FileText, BarChart3, BrainCircuit, Briefcase, 
  Calendar, Info, Clock, Cpu, Award, Star, Sliders, Plus, Flag, UserCheck, ExternalLink 
} from 'lucide-react';
import { Player, MarketFormData, DecisionFormData } from '../../types';

interface PlayerProfileModalProps {
  selectedPlayer: Player | null;
  onClose: () => void;
  profileTab: 'timeline' | 'algo' | 'market' | 'reports';
  setProfileTab: (tab: 'timeline' | 'algo' | 'market' | 'reports') => void;
  selectedSeasonIdx: number;
  setSelectedSeasonIdx: (idx: number) => void;
  setSelectedPillarDetail: (pillar: string | null) => void;
  algorithmData: Record<string, any[]>;
  marketOpportunities: any[];
  canSeeMarket: boolean;
  setMarketFormData: React.Dispatch<React.SetStateAction<MarketFormData>>;
  setIsMarketModalOpen: (open: boolean) => void;
  setSelectedMarketOppToEdit: (opp: any) => void;
  setDecisionFormData: React.Dispatch<React.SetStateAction<DecisionFormData>>;
  navigateToMatch: (matchId: string) => void;
  getPlayerTimeline: (id: string, name: string) => any[];
  getPlayerAlgoEntries: (player: any, algoData: any) => any[];
  extractPlayerBaseName: (name: string) => string;
  renderFormattedMarkdown: (text: string) => React.ReactNode;
  isDarkMode: boolean;
}

export default function PlayerProfileModal({
  selectedPlayer,
  onClose,
  profileTab,
  setProfileTab,
  selectedSeasonIdx,
  setSelectedSeasonIdx,
  setSelectedPillarDetail,
  algorithmData,
  marketOpportunities,
  canSeeMarket,
  setMarketFormData,
  setIsMarketModalOpen,
  setSelectedMarketOppToEdit,
  setDecisionFormData,
  navigateToMatch,
  getPlayerTimeline,
  getPlayerAlgoEntries,
  renderFormattedMarkdown,
  isDarkMode
}: PlayerProfileModalProps) {
  if (!selectedPlayer) return null;

  const themeBg = isDarkMode ? 'bg-[#0d131f] text-slate-100' : 'bg-slate-100 text-slate-800';
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const isGK = (selectedPlayer.position || '').toLowerCase().includes('goalkeeper') || (selectedPlayer.position || '').toLowerCase().includes('gk');
  const rawEntry = getPlayerAlgoEntries(selectedPlayer, algorithmData);
  
  const sortedEntry = [...rawEntry].sort((a, b) => {
    if (a.tag === 'Atual') return -1;
    if (b.tag === 'Atual') return 1;
    return b.tag.localeCompare(a.tag);
  });

  const activeItem = sortedEntry[selectedSeasonIdx] || sortedEntry[0];
  const playerAlgo = activeItem?.row;

  const pillarList = isGK ? [
    { title: 'GK Defesa', key: 'GK Defesa' },
    { title: 'GK Distribuicao', key: 'GK Distribuicao' },
  ] : [
    { title: 'Jogo Aéreo', key: 'Jogo Aéreo' },
    { title: 'Defesa', key: 'Defesa' },
    { title: 'Construção', key: 'Construção' },
    { title: 'Criação', key: 'Criação' },
    { title: 'Cruzamento', key: 'Cruzamento' },
    { title: 'Capacidade 1v1', key: 'Capacidade 1v1' },
    { title: 'Profundidade', key: 'Profundidade' },
    { title: 'Finalização', key: 'Finalização' },
  ];

  const timelineReports = getPlayerTimeline(selectedPlayer.id, selectedPlayer.name);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className={`${themeCard} border w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden`}>
        
        {/* CABEÇALHO DO PERFIL */}
        <div className={`${themeCard} border-b p-5 md:p-8 flex-shrink-0 relative`}>
          <button onClick={onClose} className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white transition z-10`}>
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mt-2 md:mt-0">
            {selectedPlayer.photo ? (
              <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-slate-700 shadow-xl" />
            ) : (
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl ${isDarkMode ? 'bg-[#0d131f] border-slate-800' : 'bg-slate-100 border-slate-300'} border-4 flex items-center justify-center text-slate-400 font-bold text-3xl shadow-xl`}>
                {(selectedPlayer.name || 'J').charAt(0)}
              </div>
            )}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl md:text-3xl font-black mb-2 tracking-tight">{selectedPlayer.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 text-xs md:text-sm">
                <span className="bg-blue-600 text-white px-3 py-1 md:py-1.5 rounded-lg font-bold shadow-md shadow-blue-900/20">{selectedPlayer.position}</span>
                <div className={`flex items-center gap-1.5 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-200 border-slate-300'} px-3 py-1 md:py-1.5 rounded-lg border font-medium`}>
                  {selectedPlayer.clubLogo ? <img src={selectedPlayer.clubLogo} alt={selectedPlayer.club} className="w-4 h-4 md:w-5 md:h-5 object-contain" /> : <Shield className="w-4 h-4 text-blue-500" />}
                  <span className="truncate max-w-[120px] md:max-w-none">{selectedPlayer.club}</span>
                </div>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 md:py-1.5 rounded-lg font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> {selectedPlayer.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CORPO DO PERFIL */}
        <div className={`flex-1 overflow-y-auto ${themeBg} p-4 md:p-8`}>
          {/* CARDS BIOMÉTRICOS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className={`${themeCard} p-4 rounded-2xl border flex flex-col justify-center items-center md:items-start text-center md:text-left`}>
              <span className={`${themeTextMuted} text-[10px] uppercase font-bold tracking-widest block mb-1`}>Idade</span>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-lg font-black leading-tight">
                  {selectedPlayer.age !== 'N/D' ? `${selectedPlayer.age} anos` : '--'}
                </span>
                {(() => {
                  const birth = selectedPlayer.birthDate || selectedPlayer.birth_date || selectedPlayer.dataNascimento || selectedPlayer.data_nascimento || (selectedPlayer.birthYear ? `(${selectedPlayer.birthYear})` : null);
                  return birth ? <span className={`text-[11px] ${themeTextMuted} font-semibold mt-0.5`}>{birth}</span> : null;
                })()}
              </div>
            </div>
            <div className={`${themeCard} p-4 rounded-2xl border flex flex-col justify-center items-center md:items-start text-center md:text-left`}>
              <span className={`${themeTextMuted} text-[10px] uppercase font-bold tracking-widest block mb-1`}>Nacionalidade</span>
              <span className="text-base md:text-lg font-black flex items-center justify-center md:justify-start gap-1.5 truncate w-full">
                <Flag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"/> <span className="truncate">{selectedPlayer.nationality || '--'}</span>
              </span>
            </div>
            <div className={`${themeCard} p-4 rounded-2xl border flex flex-col justify-center items-center md:items-start text-center md:text-left`}>
              <span className={`${themeTextMuted} text-[10px] uppercase font-bold tracking-widest block mb-1`}>Pé / Altura</span>
              <span className="text-lg font-black">{selectedPlayer.foot || '-'} • {selectedPlayer.height || '-'}</span>
            </div>
            <div className={`${themeCard} p-4 rounded-2xl border flex flex-col justify-center items-center md:items-start text-center md:text-left bg-blue-900/10 border-blue-900/30`}>
              <span className="text-blue-500/70 text-[10px] uppercase font-bold tracking-widest block mb-1">Jogos Vistos</span>
              <span className="text-blue-500 text-2xl font-black">{timelineReports.length}</span>
            </div>
          </div>

          {/* BARRA DE NAVEGAÇÃO DE ABAS */}
          <div className={`flex gap-4 md:gap-8 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} text-xs md:text-sm font-bold mb-6 overflow-x-auto no-scrollbar pb-1`}>
            <button onClick={() => setProfileTab('timeline')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'timeline' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <FileText className="w-4 h-4" /> Observações & Timeline
            </button>
            <button onClick={() => setProfileTab('algo')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'algo' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <BarChart3 className="w-4 h-4" /> Ratings
            </button>
            <button onClick={() => setProfileTab('reports')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'reports' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <BrainCircuit className="w-4 h-4" /> Relatórios & Análise
            </button>
            {canSeeMarket && (
              <button onClick={() => setProfileTab('market')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'market' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                <Briefcase className="w-4 h-4" /> Mercado & Decisão
              </button>
            )}
          </div>

          {/* VISTA 1: TIMELINE */}
          {profileTab === 'timeline' && (
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
          )}

          {/* VISTA 2: RATINGS */}
          {profileTab === 'algo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {sortedEntry.length > 0 && playerAlgo ? (
                <>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${themeCard} p-3.5 rounded-2xl border border-purple-500/30`}>
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                      <span className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
                        <Calendar className="w-4 h-4 text-purple-500" /> Contexto:
                      </span>
                      <div className="flex gap-2">
                        {sortedEntry.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSeasonIdx(idx)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                              selectedSeasonIdx === idx
                                ? 'bg-purple-600 text-white shadow-md'
                                : `${themeInnerCard} border text-slate-400`
                            }`}
                          >
                            {item.tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div title="Registo exato mapeado no ficheiro Excel" className="text-[10px] text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/50 font-mono opacity-60 hover:opacity-100 transition cursor-help flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0">
                      <Info className="w-3 h-3 text-purple-400" />
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

                  {(() => {
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
                      <div className="space-y-6">
                        <div className={`${themeCard} p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4`}>
                          <div className="space-y-1 text-center md:text-left">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-500 flex items-center gap-1 justify-center md:justify-start">
                              <Cpu className="w-3.5 h-3.5" /> Perfil Principal {activeItem?.tag ? `(${activeItem.tag})` : ''}
                            </span>
                            <h3 className="text-2xl font-black">{playerAlgo.Top_Profile_1_Name || playerAlgo.Melhor_Perfil || 'N/D'}</h3>
                            <p className={`text-xs ${themeTextMuted}`}>Fase da Carreira: <span className="text-emerald-500 font-bold">{playerAlgo.Fase_Carreira || 'N/D'}</span> • Tier: <span className="text-purple-400 font-bold">{playerAlgo.Scout_Tier || 'N/D'}</span></p>
                          </div>
                          
                          <div className="bg-purple-900/20 px-6 py-3.5 rounded-xl border border-purple-500/30 text-center min-w-[120px] flex flex-col items-center">
                            <span className="block text-[10px] text-purple-400 uppercase font-bold">Nota</span>
                            <span className="text-3xl font-black text-purple-400">{notaVal !== null ? notaVal.toFixed(1) : '0'}</span>
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
                                  className={`${themeInnerCard} p-3.5 rounded-xl border hover:border-blue-500/50 transition text-left group flex flex-col justify-between`}
                                >
                                  <span className={`block text-[10px] ${themeTextMuted} font-bold mb-1 group-hover:text-blue-500 transition`}>{pilar.title}</span>
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
                  })()}
                </>
              ) : (
                <div className={`flex flex-col items-center justify-center py-20 ${themeCard} rounded-2xl border border-dashed text-center px-4`}>
                  <BarChart3 className="w-12 h-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2">Sem Dados de Ratings Registados</h3>
                  <p className={`text-sm ${themeTextMuted} max-w-md`}>
                    Este atleta ainda não foi associado a um ficheiro de métricas. Faça o upload do ficheiro Excel no <strong>Painel Admin</strong> para carregar os ratings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VISTA 3: RELATÓRIOS */}
          {profileTab === 'reports' && (
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

                {(() => {
                  const rep = selectedPlayer.finalReport;
                  const reportText = typeof rep === 'string' ? rep : '';
                  const isValid = reportText && reportText !== 'N/D' && reportText !== 'Sem observações registadas.' && reportText !== '[object Object]';

                  return isValid ? (
                    <div className={`${themeInnerCard} p-5 md:p-6 rounded-xl border border-slate-700/40 text-xs md:text-sm`}>
                      {renderFormattedMarkdown(reportText)}
                    </div>
                  ) : (
                    <div className={`text-center py-12 ${themeInnerCard} rounded-xl border border-dashed text-xs md:text-sm space-y-2`}>
                      <Info className="w-6 h-6 text-slate-500 mx-auto" />
                      <p className="font-bold text-slate-400">Sem report</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* VISTA 4: MERCADO & DECISÃO */}
          {profileTab === 'market' && canSeeMarket && (() => {
            const playerOpps = marketOpportunities.filter(opp => {
              const linked = opp.fields?.Jogador || [];
              return linked.includes(selectedPlayer.id);
            });

            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className={`${themeCard} p-6 md:p-8 rounded-2xl border border-pink-500/20 relative overflow-hidden space-y-6`}>
                  <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
                    <div>
                      <h3 className="text-sm md:text-base font-bold uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-pink-500" /> Histórico de Mercado & Decisões
                      </h3>
                      <p className={`text-xs ${themeTextMuted} mt-1`}>
                        Registo dinâmico de propostas, pareceres da direção e status de contratação.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setMarketFormData(prev => ({ ...prev, playerId: selectedPlayer.id, name: selectedPlayer.name, club: selectedPlayer.club || '', position: selectedPlayer.position || '' }));
                        setIsMarketModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 hover:bg-pink-600/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Registar Oportunidade
                    </button>
                  </div>

                  {playerOpps.length > 0 ? (
                    <div className="space-y-4">
                      {playerOpps.map((opp) => {
                        const f = opp.fields || {};
                        const status = f['Status Negociação'] || 'Em Avaliação';
                        
                        let statusClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                        if (status === 'Vetado') statusClass = 'bg-red-500/20 text-red-400 border-red-500/30';
                        if (status === 'Aprovado' || status === 'Concluído') statusClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

                        return (
                          <div key={opp.id} className={`${themeInnerCard} p-5 rounded-2xl border space-y-4`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/40 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{f['Mercado Target'] || 'Janela N/D'}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusClass}`}>{status}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[11px] ${themeTextMuted}`}>Ref: <strong>{f['Scout'] || 'Departamento'}</strong></span>
                                <button
                                  onClick={() => {
                                    setSelectedMarketOppToEdit(opp);
                                    setDecisionFormData({
                                      status: f['Status Negociação'] || 'Em Avaliação',
                                      vetoReason: f['Motivo do Veto'] || '',
                                      vetoDate: f['Data do Veto'] || new Date().toISOString().split('T')[0],
                                      presidentOpinion: f['Opinião do Presidente'] || '',
                                      notesDD: f['Notas Diretor Desportivo'] || ''
                                    });
                                  }}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                                >
                                  <Sliders className="w-3 h-3" /> Decisão
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                                <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Viabilidade</span>
                                <span className="font-semibold text-emerald-400">{f['Viabilidade Financeira'] || '-'}</span>
                              </div>
                              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                                <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Confiança L3 / L2</span>
                                <span className="font-semibold text-slate-200">{f['Confiança Liga 3'] || '-'}/3 • {f['Confiança Liga 2'] || '-'}/3</span>
                              </div>
                              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                                <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Contrato</span>
                                <span className="font-semibold text-slate-200">{f['Contrato'] || '-'}</span>
                              </div>
                              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                                <span className={`block text-[9px] ${themeTextMuted} uppercase font-bold`}>Utilização</span>
                                <span className="font-semibold text-slate-200">{f['Utilização'] || '-'}</span>
                              </div>
                            </div>

                            {f['Motivo da Contratação'] && (
                              <div>
                                <span className={`block text-[10px] ${themeTextMuted} uppercase font-bold mb-1`}>Motivo da Referenciação</span>
                                <p className="text-xs text-slate-300 leading-relaxed">{f['Motivo da Contratação']}</p>
                              </div>
                            )}

                            {(f['Pontos Fortes'] || f['Pontos Fracos']) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                {f['Pontos Fortes'] && (
                                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Pontos Fortes</span>
                                    <p className="text-xs text-slate-200 leading-relaxed">{f['Pontos Fortes']}</p>
                                  </div>
                                )}
                                {f['Pontos Fracos'] && (
                                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl space-y-1">
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Pontos Fracos</span>
                                    <p className="text-xs text-slate-200 leading-relaxed">{f['Pontos Fracos']}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {status === 'Vetado' && (
                              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-2">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Detalhes do Veto</span>
                                {f['Data do Veto'] && <span className="text-[10px] text-red-300/80 block">Data: {f['Data do Veto']}</span>}
                                {f['Motivo do Veto'] && <p className="text-xs text-red-200"><strong>Motivo:</strong> {f['Motivo do Veto']}</p>}
                                {f['Opinião do Presidente'] && <p className="text-xs text-red-200"><strong>Opinião do Presidente:</strong> {f['Opinião do Presidente']}</p>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`text-center py-12 ${themeInnerCard} rounded-xl border border-dashed text-xs md:text-sm space-y-2`}>
                      <Info className="w-6 h-6 text-slate-500 mx-auto" />
                      <p className="font-bold text-slate-400">Nenhum registo de mercado para este atleta</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}