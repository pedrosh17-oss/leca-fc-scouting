'use client';

import React from 'react';
import { Trophy, Calendar, ChevronDown, ChevronUp, Plus, Shield, UserCheck, Edit3, Loader2, Zap, Activity, Crosshair, BrainCircuit, Search, ExternalLink } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import CustomMultiSelect from '../ui/CustomMultiSelect';
import { Match, Player, Scout } from '../../types';
import { TACTICS_OPTIONS, METRIC_LEVELS } from '../../constants/options';

interface MatchesTabProps {
  matches: Match[];
  players: Player[];
  displayScouts: Scout[];
  canCreateMatches: boolean;
  canEditMatches: boolean;
  expandedMatchId: string | null;
  toggleMatch: (id: string) => void;
  editingMatchId: string | null;
  startEditMatchContext: (match: Match) => void;
  setExpandedMatchEdit: (id: string | null) => void;
  reportData: any;
  setReportData: (data: any) => void;
  handleReportSubmit: (matchId: string) => void;
  submittingReport: boolean;
  setIsAddHighlightOpen: (data: any) => void;
  setNewHighlightData: (data: any) => void;
  setEditingHighlight: (data: any) => void;
  setSelectedPlayer: (player: Player) => void;
  setProfileTab: (tab: string) => void;
  setSelectedSeasonIdx: (idx: number) => void;
  navigateToMatch: (matchId: string) => void;
  setPreGameData: (data: any) => void;
  preGameData: any;
  authScoutId: string | null;
  setIsRegisterOpen: (open: boolean) => void;
  isDarkMode: boolean;
}

export default function MatchesTab({
  matches, players, displayScouts, canCreateMatches, canEditMatches, expandedMatchId, toggleMatch,
  editingMatchId, startEditMatchContext, setExpandedMatchEdit, reportData, setReportData,
  handleReportSubmit, submittingReport, setIsAddHighlightOpen, setNewHighlightData, setEditingHighlight,
  setSelectedPlayer, setProfileTab, setSelectedSeasonIdx, navigateToMatch, setPreGameData, preGameData, authScoutId, setIsRegisterOpen, isDarkMode
}: MatchesTabProps) {
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeInnerCard = isDarkMode ? 'bg-[#0d131f] border-slate-800/80' : 'bg-slate-50 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 md:mb-6">
        <p className={`text-xs md:text-sm ${themeTextMuted} hidden sm:block`}>Motor de observação de equipas e atletas.</p>
        {canCreateMatches && (
          <button onClick={() => { setPreGameData({ ...preGameData, scoutIds: authScoutId ? [authScoutId] : [] }); setIsRegisterOpen(true); }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 md:py-3 rounded-xl text-sm md:text-base font-bold transition shadow-lg shadow-blue-900/20">
            <Plus className="w-5 h-5" /> Agendar Jogo
          </button>
        )}
      </div>

      <div className="grid gap-3 md:gap-4">
        {matches.map((match) => {
          const isExpanded = expandedMatchId === match.id;
          const isEditingContext = editingMatchId === match.id;

          return (
            <div key={match.id} id={`match-${match.id}`} className={`${themeCard} border ${isExpanded ? 'border-blue-500/50' : ''} rounded-xl overflow-hidden transition-all duration-300 shadow-sm`}>
              <div onClick={() => toggleMatch(match.id)} className={`p-4 md:p-5 flex items-center justify-between cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className={`p-3 rounded-xl ${isExpanded ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'} border border-blue-500/20 flex-shrink-0 transition-colors`}><Trophy className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-base truncate leading-tight mb-1 md:mb-0">{match.matchName}</h3>
                    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] md:text-xs ${themeTextMuted} mt-1`}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {match.gameDate}</span>
                      {match.competition && match.competition !== 'N/D' && <span>•</span>}
                      {match.competition && match.competition !== 'N/D' && <span className="text-blue-500 font-semibold truncate max-w-[120px] md:max-w-none">{match.competition}</span>}
                      <span>•</span>
                      <span className={`${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} px-1.5 py-0.5 rounded`}>{match.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-6 flex-shrink-0 pl-2">
                  <div className="text-right hidden sm:block">
                    <span className="block text-sm font-bold text-emerald-500">{match.playersCount}</span>
                    <span className={`text-[9px] ${themeTextMuted} uppercase tracking-wider font-bold`}>Atletas</span>
                  </div>
                  <div className={`text-slate-400 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'} p-2 md:p-1.5 rounded-lg`}>{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                </div>
              </div>

              {isExpanded && (
                <div className={`p-4 md:p-5 border-t ${isDarkMode ? 'border-slate-800 bg-[#0d131f]' : 'border-slate-200 bg-slate-50'} space-y-6 md:space-y-5`}>
                  
                  <div className={`${themeCard} border p-4 rounded-xl text-xs md:text-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                    <div className="space-y-2 md:space-y-1.5 w-full md:w-auto">
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-400"/> <strong>Táticas:</strong> {match.homeTactic} / {match.awayTactic}</div>
                      <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-slate-400"/> <strong>Scout:</strong> <span className="text-blue-500 font-medium">{match.scout}</span></div>
                    </div>
                    {canEditMatches && (
                      <button onClick={() => startEditMatchContext(match)} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-blue-600/20 border border-blue-500/30 text-blue-500 rounded-xl md:rounded-lg font-bold hover:bg-blue-600/30 transition">
                        <Edit3 className="w-4 h-4" /> {isEditingContext ? 'Fechar' : 'Editar Jogo'}
                      </button>
                    )}
                  </div>

                  {isEditingContext && canEditMatches && (
                    <div className={`${themeCard} border border-blue-500/30 p-4 md:p-5 rounded-xl space-y-4 text-xs md:text-sm shadow-inner animate-in fade-in slide-in-from-top-2`}>
                      <h4 className="font-bold text-blue-500 uppercase tracking-wider mb-4 border-b border-slate-700/40 pb-2">Editar Detalhes do Jogo</h4>
                      <div className="mb-4">
                        <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Scouts Observadores</label>
                        <CustomMultiSelect options={displayScouts.map(s => ({ value: s.id, label: s.name, image: s.photo }))} selectedIds={reportData.scoutIds} onChange={(ids: string[]) => setReportData({ ...reportData, scoutIds: ids })} placeholder="Selecionar Scouts..." isDarkMode={isDarkMode} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Tática Casa</label>
                          <CustomSelect options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))} value={reportData.homeTactic} onChange={val => setReportData({ ...reportData, homeTactic: val })} placeholder="Ex: 1-4-3-3" isDarkMode={isDarkMode} />
                        </div>
                        <div>
                          <label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Tática Fora</label>
                          <CustomSelect options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))} value={reportData.awayTactic} onChange={val => setReportData({ ...reportData, awayTactic: val })} placeholder="Ex: 1-4-3-3" isDarkMode={isDarkMode} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <div><label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Ritmo</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.tempo} onChange={val => setReportData({ ...reportData, tempo: val })} placeholder="-" isDarkMode={isDarkMode} /></div>
                        <div><label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Físico</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.intensity} onChange={val => setReportData({ ...reportData, intensity: val })} placeholder="-" isDarkMode={isDarkMode} /></div>
                        <div><label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Técnica</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.technical} onChange={val => setReportData({ ...reportData, technical: val })} placeholder="-" isDarkMode={isDarkMode} /></div>
                        <div><label className={`block ${themeTextMuted} mb-1.5 font-bold`}>Mental</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.pressure} onChange={val => setReportData({ ...reportData, pressure: val })} placeholder="-" isDarkMode={isDarkMode} /></div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-2 border-t border-slate-700/40">
                        <button type="button" onClick={() => setExpandedMatchEdit(null)} className={`px-4 py-3 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-bold rounded-xl md:rounded-lg`}>Cancelar</button>
                        <button type="button" disabled={submittingReport} onClick={() => handleReportSubmit(match.id)} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                          {submittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Alterações'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <h4 className={`text-xs md:text-sm font-bold ${themeTextMuted} uppercase tracking-wider`}>Avaliações Individuais (Highlights)</h4>
                      {canEditMatches && (
                        <button 
                          onClick={() => { setIsAddHighlightOpen({ matchId: match.id, matchName: match.matchName }); setNewHighlightData({ playerId: '', notes: '' }); }}
                          className="w-full sm:w-auto px-4 py-3 md:py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-500 text-xs md:text-sm font-bold rounded-xl md:rounded-lg transition flex justify-center items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Adicionar Atleta
                        </button>
                      )}
                    </div>

                    {match.highlightedPlayers && match.highlightedPlayers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {match.highlightedPlayers.map((p: any, idx: number) => {
                          const fullP = players.find(player => (player.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase()) || p;
                          const isUnidentified = fullP.id?.includes('unidentified') || !fullP.id;

                          return (
                            <div key={p.id || idx} className={`${themeCard} border p-4 md:p-5 rounded-xl flex flex-col gap-3 shadow-sm relative overflow-hidden group`}>
                              {isUnidentified && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>}
                              <div className={`flex items-start justify-between gap-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-3`}>
                                <div className="flex items-center gap-3 min-w-0">
                                  {fullP.photo ? (
                                    <img src={fullP.photo} alt={fullP.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0" />
                                  ) : (
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0`}>
                                      {(fullP.name || 'J').charAt(0)}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-sm md:text-base truncate flex items-center gap-1.5">
                                      {fullP.name} {isUnidentified && <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] rounded font-bold uppercase">S/Ficha</span>}
                                    </h5>
                                    <p className={`text-[11px] md:text-xs ${themeTextMuted} mt-0.5 truncate`}>
                                      <span className="text-blue-500 font-medium">{fullP.position && fullP.position !== 'N/D' ? fullP.position : 'Atleta'}</span> <span className="hidden sm:inline">• {fullP.club && fullP.club !== 'N/D' ? fullP.club : ''}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                                  {canEditMatches && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingHighlight({ matchId: match.id, matchName: match.matchName, player: fullP, highlightId: p.highlightId || null, notes: p.note && p.note !== 'Sem notas registadas.' ? p.note : '' }); }}
                                      className={`p-2 md:px-2.5 md:py-1.5 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'} border text-xs font-medium rounded-lg transition flex items-center justify-center`}
                                    >
                                      <Edit3 className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:block">Editar</span>
                                    </button>
                                  )}
                                  {!isUnidentified && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setSelectedPlayer(fullP); setProfileTab('timeline'); setSelectedSeasonIdx(0); }}
                                      className="p-2 md:px-2.5 md:py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 border border-blue-500/30 text-xs font-medium rounded-lg transition flex items-center justify-center"
                                    >
                                      <Search className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:block">Perfil</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className={`text-xs md:text-sm leading-relaxed ${themeInnerCard} p-3 md:p-4 rounded-lg border font-sans whitespace-pre-wrap`}>
                                {p.note || <span className="text-slate-400 italic">Sem nota descritiva registada.</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`text-xs md:text-sm ${themeTextMuted} ${themeCard} p-8 rounded-xl border border-dashed text-center flex flex-col items-center gap-2`}>
                        <UserCheck className="w-8 h-8 text-slate-400 mb-2" />
                        Não existem avaliações individuais registadas neste jogo.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <div className={`${themeInnerCard} p-3 md:p-4 rounded-xl border`}><span className={`flex items-center gap-1.5 text-[10px] md:text-xs ${themeTextMuted} uppercase tracking-wider font-bold mb-1`}><Zap className="w-3.5 h-3.5"/> Ritmo</span><span className="text-sm md:text-base font-bold">{match.tempo}</span></div>
                    <div className={`${themeInnerCard} p-3 md:p-4 rounded-xl border`}><span className={`flex items-center gap-1.5 text-[10px] md:text-xs ${themeTextMuted} uppercase tracking-wider font-bold mb-1`}><Activity className="w-3.5 h-3.5"/> Intensidade</span><span className="text-sm md:text-base font-bold">{match.intensity}</span></div>
                    <div className={`${themeInnerCard} p-3 md:p-4 rounded-xl border`}><span className={`flex items-center gap-1.5 text-[10px] md:text-xs ${themeTextMuted} uppercase tracking-wider font-bold mb-1`}><Crosshair className="w-3.5 h-3.5"/> Técnica</span><span className="text-sm md:text-base font-bold">{match.technical}</span></div>
                    <div className={`${themeInnerCard} p-3 md:p-4 rounded-xl border`}><span className={`flex items-center gap-1.5 text-[10px] md:text-xs ${themeTextMuted} uppercase tracking-wider font-bold mb-1`}><BrainCircuit className="w-3.5 h-3.5"/> Pressão</span><span className="text-sm md:text-base font-bold">{match.pressure}</span></div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}