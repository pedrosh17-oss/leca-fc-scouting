'use client';

import React from 'react';
import { X, Activity, Shield, FileText, BarChart3, BrainCircuit, Briefcase, Flag } from 'lucide-react';
import { Player, MarketFormData, DecisionFormData } from '../../types';

import ProfileTimelineTab from './playerProfileTabs/ProfileTimelineTab';
import ProfileAlgoTab from './playerProfileTabs/ProfileAlgoTab';
import ProfileReportsTab from './playerProfileTabs/ProfileReportsTab';
import ProfileMarketTab from './playerProfileTabs/ProfileMarketTab';

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
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const isGK = (selectedPlayer.position || '').toLowerCase().includes('goalkeeper') || (selectedPlayer.position || '').toLowerCase().includes('gk');
  const rawEntry = getPlayerAlgoEntries(selectedPlayer, algorithmData);
  
  const sortedEntry = [...rawEntry].sort((a, b) => {
    const tagA = a.tag || '';
    const tagB = b.tag || '';
    if (tagA === 'Atual') return -1;
    if (tagB === 'Atual') return 1;

    const isOldA = tagA.includes('25_26') || tagA.includes('25/26');
    const isOldB = tagB.includes('25_26') || tagB.includes('25/26');
    if (isOldA && !isOldB) return 1;
    if (!isOldA && isOldB) return -1;

    return tagA.localeCompare(tagB);
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

          <div className={`flex gap-4 md:gap-8 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} text-xs md:text-sm font-bold mb-6 overflow-x-auto no-scrollbar pb-1`}>
            <button onClick={() => setProfileTab('timeline')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'timeline' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <FileText className="w-4 h-4" /> Observações & Timeline
            </button>
            <button 
  onClick={() => setProfileTab('algo')} 
  className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
    profileTab === 'algo' 
      ? isDarkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-700 text-indigo-800' 
      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
  }`}
>
  <BarChart3 className="w-4 h-4" /> Ratings
</button>
            <button onClick={() => setProfileTab('reports')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'reports' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <BrainCircuit className="w-4 h-4" /> Relatórios & Análise
            </button>
            {canSeeMarket && (
              <button onClick={() => setProfileTab('market')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'market' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                <Briefcase className="w-4 h-4" /> Mercado & Decisão
              </button>
            )}
          </div>

          {profileTab === 'timeline' && (
            <ProfileTimelineTab timelineReports={timelineReports} onClose={onClose} navigateToMatch={navigateToMatch} isDarkMode={isDarkMode} />
          )}

          {profileTab === 'algo' && (
            <ProfileAlgoTab sortedEntry={sortedEntry} selectedSeasonIdx={selectedSeasonIdx} setSelectedSeasonIdx={setSelectedSeasonIdx} playerAlgo={playerAlgo} isGK={isGK} pillarList={pillarList} setSelectedPillarDetail={setSelectedPillarDetail} isDarkMode={isDarkMode} />
          )}

          {profileTab === 'reports' && (
            <ProfileReportsTab selectedPlayer={selectedPlayer} renderFormattedMarkdown={renderFormattedMarkdown} isDarkMode={isDarkMode} />
          )}

          {profileTab === 'market' && (
            <ProfileMarketTab selectedPlayer={selectedPlayer} marketOpportunities={marketOpportunities} canSeeMarket={canSeeMarket} setMarketFormData={setMarketFormData} setIsMarketModalOpen={setIsMarketModalOpen} setSelectedMarketOppToEdit={setSelectedMarketOppToEdit} setDecisionFormData={setDecisionFormData} isDarkMode={isDarkMode} />
          )}

        </div>
      </div>
    </div>
  );
}