'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Trophy, Shield, ArrowRight, Loader2, LogOut, CheckCircle2, Menu, X, 
  LayoutDashboard, BarChart3, Briefcase, Building2, Sliders, Sun, Moon, 
  Calendar, UserCheck, ExternalLink, Globe 
} from 'lucide-react';

import { DEPT_PASSWORD } from './constants/options';
import { getTheme } from './constants/theme';
import { Player, Team, Scout, DecisionFormData, MarketFormData } from './types';
import { renderFormattedMarkdown, extractPlayerBaseName, extractContextTag, getPlayerAlgoEntries, getUserTitle } from './utils/helpers';
import { useScoutingData, getRoleForUser } from './hooks/useScoutingData';
import { useExcelUploader } from './hooks/useExcelUploader';

import CustomSelect from './components/ui/CustomSelect';
import CustomMultiSelect from './components/ui/CustomMultiSelect';
import MarketModal from './components/modals/MarketModal';
import MarketDecisionModal from './components/modals/MarketDecisionModal';
import PlayerProfileModal from './components/modals/PlayerProfileModal';
import NewTeamModal from './components/modals/NewTeamModal';
import NewPlayerModal from './components/modals/NewPlayerModal';
import PillarDetailModal from './components/modals/PillarDetailModal';
import DashboardTab from './components/tabs/DashboardTab';
import MarketTab from './components/tabs/MarketTab';
import PlayersTab from './components/tabs/PlayersTab';
import TeamsTab from './components/tabs/TeamsTab';
import StatsTab from './components/tabs/StatsTab';
import MatchesTab from './components/tabs/MatchesTab';
import ScoutsTab from './components/tabs/ScoutsTab';
import AdminTab from './components/tabs/AdminTab';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = getTheme(isDarkMode);
  
  const {
    players, teams, matches, competitions, scouts, marketOpportunities, algorithmData, setAlgorithmData, loading,
    isAuthenticated, setIsAuthenticated, authScoutId, setAuthScoutId, authScoutName, setAuthScoutName,
    userRole, setUserRole, loadData
  } = useScoutingData();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  const { uploadingExcel, handleFileUpload } = useExcelUploader(setAlgorithmData, showToast, extractPlayerBaseName, extractContextTag);

  // Estados da UI
  const [activeTab, setActiveTab] = useState<'dashboard'|'players'|'teams'|'matches'|'scouts'|'admin'|'stats'|'market'>('dashboard');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lecaLogoUrl = "/logo.png";

  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedScout, setSelectedScout] = useState<Scout | null>(null);
  
  const [profileTab, setProfileTab] = useState<'timeline'|'algo'|'market'|'reports'>('timeline');
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);
  const [selectedPillarDetail, setSelectedPillarDetail] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [editingMatchId, setExpandedMatchEdit] = useState<string | null>(null);
  
  const [comparePlayerKeyA, setComparePlayerKeyA] = useState('');
  const [comparePlayerKeyB, setComparePlayerKeyB] = useState('');
  const [comparePlayerKeyC, setComparePlayerKeyC] = useState('');

  // Atribuição de Mercados aos Scouts
  const [scoutMarketAssignments, setScoutMarketAssignments] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Garante que tentamos ler o valor guardado sem falhar
    try {
      const savedAssignments = localStorage.getItem('leca_scout_markets');
      if (savedAssignments) setScoutMarketAssignments(JSON.parse(savedAssignments));
    } catch (e) {
      console.error("Erro ao carregar mercados guardados", e);
    }
  }, []);

  // Estados de Formulários e Modais
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [newTeamData, setNewTeamData] = useState({ name: '', competitionId: '' });
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [adminMarkets, setAdminMarkets] = useState<string[]>([]);
  const [newMarketInput, setNewMarketInput] = useState('');
  
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [submittingMarket, setSubmittingMarket] = useState(false);
  const initialMarketForm: MarketFormData = { playerId: '', name: '', club: '', position: '', foot: '', birthDate: '', offerDate: new Date().toISOString().split('T')[0], marketTarget: '', scout: '', viability: '', confLiga3: '', confLiga2: '', contract: '', utilization: '', strengths: '', weaknesses: '', reason: '', similarity: '', mental: '' };
  const [marketFormData, setMarketFormData] = useState<MarketFormData>(initialMarketForm);
  const [selectedMarketOppToEdit, setSelectedMarketOppToEdit] = useState<any>(null);
  const [decisionFormData, setDecisionFormData] = useState<DecisionFormData>({ status: 'Em Avaliação', vetoReason: '', vetoDate: new Date().toISOString().split('T')[0], presidentOpinion: '', notesDD: '' });
  const [updatingDecision, setUpdatingDecision] = useState(false);

  // Destaques e Observações Recentes
  const getRecentHighlights = () => {
    const list: any[] = [];
    matches.forEach(m => {
      if (m.highlightedPlayers) {
        m.highlightedPlayers.forEach((p: any) => {
          if (p.note && p.note !== 'Sem notas registadas.') {
            list.push({ ...p, matchId: m.id, matchName: m.matchName, gameDate: m.gameDate, scout: m.scout });
          }
        });
      }
    });
    return list.slice(0, 4);
  };

  const getScoutMatches = (scoutName: string) => {
    return matches.filter(m => (m.scout || '').toLowerCase().includes((scoutName || '').toLowerCase()));
  };

  const handleSaveScoutMarkets = (scoutId: string, assignedMarkets: string[]) => {
    const updated = { ...scoutMarketAssignments, [scoutId]: assignedMarkets };
    setScoutMarketAssignments(updated);
    localStorage.setItem('leca_scout_markets', JSON.stringify(updated));
    showToast("Mercados atualizados para este Scout!");
  };

  const getScoutMarketOptions = () => {
    const seriesOptions = [
      { value: 'Liga 3 - Série A', label: 'Liga 3 - Série A' },
      { value: 'Liga 3 - Série B', label: 'Liga 3 - Série B' },
      { value: 'CP - Série A', label: 'CP - Série A' },
      { value: 'CP - Série B', label: 'CP - Série B' },
      { value: 'CP - Série C', label: 'CP - Série C' },
      { value: 'CP - Série D', label: 'CP - Série D' },
    ];
    const otherComps = competitions
      .map(c => c.name)
      .filter(name => 
        !name.toLowerCase().includes('liga 3') && 
        !name.toLowerCase().includes('campeonato de portugal') &&
        !name.toLowerCase().includes('cp')
      )
      .map(name => ({ value: name, label: name }));

    return [...seriesOptions, ...otherComps];
  };

  // Seletores para o separador Stats
  const algoOptions = useMemo(() => {
    if (!algorithmData) return [];
    const optionsMap = new Map<string, { value: string; label: string; row: any }>();
    Object.entries(algorithmData).forEach(([key, items]) => {
      if (!items || key.endsWith('_gk')) return;
      items.forEach((item, seasonIdx) => {
        const row = item.row || {};
        const rawName = row.Player || row.Player_ID || key;
        const cleanPlayerName = rawName.replace(/\s*\([^)]*\)/g, '').trim();
        const teamName = row.Team_Calc || row.Team || '';
        const seasonTag = item.tag || extractContextTag(row) || 'Atual';
        
        let label = cleanPlayerName;
        if (teamName && seasonTag) label += ` (${teamName} - ${seasonTag})`;
        else if (teamName) label += ` (${teamName})`;
        
        optionsMap.set(`${cleanPlayerName}_${teamName}_${seasonTag}`.toLowerCase(), { value: `${key}___${seasonIdx}`, label, row });
      });
    });
    return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [algorithmData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === DEPT_PASSWORD && authScoutId) {
      const user = scouts.find(s => s.id === authScoutId);
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('leca_scout_auth', authScoutId);
        setAuthScoutName(user.name);
        setUserRole(getRoleForUser(user.name));
        setAuthError('');
      }
    } else setAuthError('Password incorreta ou Perfil não selecionado.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false); setAuthScoutId(null); setAuthScoutName(null);
    setUserRole('SCOUT'); setAuthPassword(''); setActiveTab('dashboard');
    localStorage.removeItem('leca_scout_auth');
  };

  const handleMarketSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmittingMarket(true);
    try {
      const res = await fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...marketFormData, scout: marketFormData.scout || authScoutName }) });
      if (res.ok) { setIsMarketModalOpen(false); setMarketFormData(initialMarketForm); await loadData(); showToast("Oportunidade registada!"); }
    } catch (err) { console.error(err); showToast("Erro de ligação."); } finally { setSubmittingMarket(false); }
  };

  const navigateToMatch = (matchId: string) => {
    setSelectedTeam(null); setSelectedPlayer(null); setSelectedScout(null);
    setActiveTab('matches'); setExpandedMatchId(matchId);
    setTimeout(() => document.getElementById(`match-${matchId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-400" />
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400">A carregar LEÇA FC...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden`}>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className={`w-full max-w-md ${theme.card} backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 z-10 border`}>
          <div className="w-24 h-24 bg-slate-900 rounded-2xl border border-slate-700/60 flex items-center justify-center p-2 mb-6 shadow-xl relative overflow-hidden group">
            <img src={lecaLogoUrl} alt="Leça FC" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wide mb-1 text-center">LEÇA FC</h1>
          <p className={`text-xs md:text-sm ${theme.textMuted} mb-8 text-center font-medium`}>Departamento de Scouting e Prospeção</p>
          <form onSubmit={handleLogin} className="w-full space-y-5">
             <div>
                <label className={`block text-[10px] md:text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-2`}>Quem és tu?</label>
                <CustomSelect options={scouts.map(s => ({ value: s.id, label: s.name, image: s.photo }))} value={authScoutId || ''} onChange={val => setAuthScoutId(val)} placeholder="Seleciona o teu perfil..." searchable={true} isDarkMode={isDarkMode} />
             </div>
             <div>
                <label className={`block text-[10px] md:text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-2`}>Password do Departamento</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className={`w-full border rounded-xl p-3.5 focus:outline-none focus:border-blue-500 shadow-inner ${isDarkMode ? 'bg-[#0d131f] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`} placeholder="••••••••" required />
             </div>
             {authError && <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center"><p className="text-xs text-red-400 font-medium">{authError}</p></div>}
             <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition mt-2 flex items-center justify-center gap-2">
                Entrar no Sistema <ArrowRight className="w-4 h-4" />
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${theme.bg} font-sans relative pb-10 md:pb-6 transition-colors duration-200`}>
      {toastMessage && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 font-medium text-xs md:text-sm max-w-[90vw] md:max-w-md border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className={`sticky top-0 z-40 ${theme.header} backdrop-blur-md border-b px-5 py-4 md:p-6 md:m-6 md:rounded-xl md:static flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-center p-1 shadow flex-shrink-0"><img src={lecaLogoUrl} alt="Leça FC" className="w-full h-full object-contain" /></div>
          <div><span className={`hidden md:block text-[10px] md:text-xs font-semibold tracking-wider ${theme.textMuted} uppercase mb-0.5`}>Departamento de Scouting</span><h1 className="text-xl md:text-2xl font-bold tracking-wide">LEÇA FC</h1></div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-200 border-slate-300 text-slate-700'}`}>
            {isDarkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>

          {/* BOTÃO DO MENU HAMBÚRGUER (EXCLUSIVO MOBILE) */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2.5 rounded-xl border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'}`}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-700">
            <div className="flex flex-col items-end"><span className="text-xs font-medium">{authScoutName}</span><span className="text-[9px] text-blue-500 font-bold uppercase">{getUserTitle(authScoutName || '')}</span></div>
            <button onClick={handleLogout} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* PAINEL EXPANSÍVEL DO MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className={`md:hidden mx-5 mb-4 p-3 rounded-2xl border ${theme.card} space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200`}>
          <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Início
          </button>
          <button onClick={() => { setActiveTab('stats'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <BarChart3 className="w-4 h-4" /> Stats
          </button>
          <button onClick={() => { setActiveTab('market'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'market' ? 'bg-pink-600 text-white' : 'text-pink-400 hover:bg-slate-800/50'}`}>
            <Briefcase className="w-4 h-4" /> Mercado ({marketOpportunities.length})
          </button>
          <button onClick={() => { setActiveTab('players'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Users className="w-4 h-4" /> Jogadores ({players.length})
          </button>
          <button onClick={() => { setActiveTab('teams'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Building2 className="w-4 h-4" /> Equipas ({teams.length})
          </button>
          <button onClick={() => { setActiveTab('matches'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Trophy className="w-4 h-4" /> Jogos ({matches.length})
          </button>
          <button onClick={() => { setActiveTab('scouts'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Shield className="w-4 h-4" /> Scouts
          </button>
          {userRole === 'ADMIN' && (
            <button onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-slate-800/50'}`}>
              <Sliders className="w-4 h-4" /> Painel Admin
            </button>
          )}
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between px-2">
            <span className="text-xs text-slate-300 font-medium">{authScoutName}</span>
            <button onClick={handleLogout} className="text-xs text-red-400 font-bold flex items-center gap-1 hover:underline">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO DESKTOP */}
      <div className="hidden md:flex max-w-6xl mx-auto mb-6 flex-wrap gap-3 px-6 md:px-0">
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><LayoutDashboard className="w-4 h-4" /> Início</button>
        <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'stats' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><BarChart3 className="w-4 h-4" /> Stats</button>
        <button onClick={() => setActiveTab('market')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'market' ? 'bg-pink-600 text-white' : `${theme.card} text-pink-400`}`}><Briefcase className="w-4 h-4" /> Mercado ({marketOpportunities.length})</button>
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><Users className="w-4 h-4" /> Jogadores ({players.length})</button>
        <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'teams' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><Building2 className="w-4 h-4" /> Equipas ({teams.length})</button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><Trophy className="w-4 h-4" /> Jogos ({matches.length})</button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white' : `${theme.card} text-slate-400`}`}><Shield className="w-4 h-4" /> Scouts</button>
        {userRole === 'ADMIN' && (
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'admin' ? 'bg-purple-600 text-white' : `${theme.card} text-purple-400`}`}><Sliders className="w-4 h-4" /> Admin</button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-4 md:mt-0">
        {activeTab === 'dashboard' && <DashboardTab players={players} matches={matches} teams={teams} displayScouts={scouts} canCreateMatches={true} authScoutId={authScoutId} preGameData={{} as any} setPreGameData={()=>{}} setIsMarketModalOpen={setIsMarketModalOpen} setIsRegisterOpen={()=>{}} setActiveTab={setActiveTab} getRecentHighlights={getRecentHighlights} navigateToMatch={navigateToMatch} isDarkMode={isDarkMode} />}
        {activeTab === 'market' && <MarketTab marketOpportunities={marketOpportunities} players={players} setIsMarketModalOpen={setIsMarketModalOpen} setSelectedMarketOppToEdit={setSelectedMarketOppToEdit} setDecisionFormData={setDecisionFormData} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} isDarkMode={isDarkMode} />}
        
        {/* TABS REFATORADAS (PLAYERS E TEAMS AGORA TÊM ESTADOS INTERNOS PRÓPRIOS DE PESQUISA) */}
        {activeTab === 'players' && <PlayersTab filteredPlayers={players} teams={teams} visibleCount={visibleCount} setVisibleCount={setVisibleCount} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} setSelectedSeasonIdx={setSelectedSeasonIdx} isDarkMode={isDarkMode} />}
        {activeTab === 'teams' && <TeamsTab filteredTeams={teams} players={players} matches={matches} setSelectedTeam={setSelectedTeam} canCreateMatches={true} setIsNewTeamOpen={setIsNewTeamOpen} isDarkMode={isDarkMode} />}
        
        {activeTab === 'stats' && <StatsTab comparePlayerKeyA={comparePlayerKeyA} setComparePlayerKeyA={setComparePlayerKeyA} comparePlayerKeyB={comparePlayerKeyB} setComparePlayerKeyB={setComparePlayerKeyB} comparePlayerKeyC={comparePlayerKeyC} setComparePlayerKeyC={setComparePlayerKeyC} algoOptions={algoOptions} algorithmData={algorithmData} extractContextTag={extractContextTag} isDarkMode={isDarkMode} />}
        {activeTab === 'matches' && <MatchesTab matches={matches} players={players} displayScouts={scouts} canCreateMatches={true} canEditMatches={true} expandedMatchId={expandedMatchId} toggleMatch={id => setExpandedMatchId(expandedMatchId === id ? null : id)} editingMatchId={editingMatchId} startEditMatchContext={m => setExpandedMatchEdit(editingMatchId === m.id ? null : m.id)} setExpandedMatchEdit={setExpandedMatchEdit} reportData={{} as any} setReportData={()=>{}} handleReportSubmit={async () => {}} submittingReport={false} setIsAddHighlightOpen={()=>{}} setNewHighlightData={()=>{}} setEditingHighlight={()=>{}} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} setSelectedSeasonIdx={setSelectedSeasonIdx} navigateToMatch={navigateToMatch} setPreGameData={()=>{}} preGameData={{} as any} authScoutId={authScoutId} setIsRegisterOpen={()=>{}} isDarkMode={isDarkMode} />}
        {activeTab === 'scouts' && <ScoutsTab displayScouts={scouts} scoutMarketAssignments={scoutMarketAssignments} setSelectedScout={setSelectedScout} getUserTitle={getUserTitle} getScoutMatches={getScoutMatches} matches={matches} isDarkMode={isDarkMode} />}
        {activeTab === 'admin' && <AdminTab isAdmin={userRole === 'ADMIN'} uniqueAlgoPlayersCount={0} uploadingExcel={uploadingExcel} handleFileUpload={handleFileUpload} handleAddMarket={()=>{}} newMarketInput={newMarketInput} setNewMarketInput={setNewMarketInput} adminMarkets={adminMarkets} handleRemoveMarket={()=>{}} scouts={scouts} isDarkMode={isDarkMode} />}
      </div>

      <MarketModal isOpen={isMarketModalOpen} onClose={() => setIsMarketModalOpen(false)} marketFormData={marketFormData} setMarketFormData={setMarketFormData} onSubmit={handleMarketSubmit} submittingMarket={submittingMarket} players={players} teams={teams} displayScouts={scouts} onSelectExistingPlayer={()=>{}} isDarkMode={isDarkMode} />
      
      <PlayerProfileModal selectedPlayer={selectedPlayer} onClose={() => setSelectedPlayer(null)} profileTab={profileTab} setProfileTab={setProfileTab} selectedSeasonIdx={selectedSeasonIdx} setSelectedSeasonIdx={setSelectedSeasonIdx} setSelectedPillarDetail={setSelectedPillarDetail} algorithmData={algorithmData} marketOpportunities={marketOpportunities} canSeeMarket={true} setMarketFormData={setMarketFormData} setIsMarketModalOpen={setIsMarketModalOpen} setSelectedMarketOppToEdit={setSelectedMarketOppToEdit} setDecisionFormData={setDecisionFormData} navigateToMatch={navigateToMatch} getPlayerTimeline={() => []} getPlayerAlgoEntries={getPlayerAlgoEntries} extractPlayerBaseName={extractPlayerBaseName} renderFormattedMarkdown={renderFormattedMarkdown} isDarkMode={isDarkMode} />

      {/* --------------------- MODALS CENTRADOS RESTAURADOS --------------------- */}

      {/* MODAL PERFIL EQUIPA (VERSÃO RESTAURADA) */}
      {selectedTeam && (() => {
        const teamPlayers = players.filter(p => (p.club || '').toLowerCase() === (selectedTeam.name || '').toLowerCase());
        const teamMatches = matches.filter(m => (m.matchName || '').toLowerCase().includes((selectedTeam.name || '').toLowerCase()));

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`${getTheme(isDarkMode).card} border w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-5 md:p-6 space-y-6 animate-in fade-in zoom-in-95`}>
              
              <div className={`flex justify-between items-start border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
                <div className="flex items-center gap-4">
                  {selectedTeam.logo ? (
                    <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-14 h-14 md:w-16 md:h-16 object-contain p-1.5 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0" />
                  ) : (
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold flex-shrink-0`}>
                      <Building2 className="w-7 h-7 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{selectedTeam.name}</h2>
                    <p className="text-xs text-blue-500 font-medium mt-1">
                      {selectedTeam.competition && selectedTeam.competition !== 'N/D' ? selectedTeam.competition : ''}
                      {selectedTeam.competition && selectedTeam.competition !== 'N/D' && selectedTeam.country ? <span className="text-slate-400"> • </span> : ''}
                      {selectedTeam.country && <span className="text-slate-400">{selectedTeam.country}</span>}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className={`p-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full text-slate-400 hover:text-white transition`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50`}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Jogos Observados</span>
                  <span className="text-xl font-bold text-emerald-500">{teamMatches.length} Partidas</span>
                </div>
                <div className={`${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50`}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Estatuto de Observação</span>
                  <span className="text-xl font-bold text-blue-500">{selectedTeam.status || 'Monitored'}</span>
                </div>
              </div>

              <div>
                <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>Atletas de Interesse na Base de Dados ({teamPlayers.length})</h3>
                {teamPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {teamPlayers.map(p => (
                      <div key={p.id} className={`${getTheme(isDarkMode).card} p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between`}>
                        <div className="flex items-center gap-3 min-w-0">
                          {p.photo ? (
                            <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                              {(p.name || 'J').charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm truncate">{p.name}</h4>
                            <p className="text-xs text-blue-500 font-medium mt-0.5 truncate">{p.position}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTeam(null);
                            setSelectedPlayer(p);
                            setProfileTab('timeline');
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 border border-blue-500/30 text-xs font-bold rounded-lg transition flex-shrink-0 ml-2"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50 text-center`}>
                    Ainda não existem atletas desta equipa registados na base de dados.
                  </div>
                )}
              </div>

              <div>
                <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>Histórico de Jogos Observados ({teamMatches.length})</h3>
                {teamMatches.length > 0 ? (
                  <div className="space-y-2.5">
                    {teamMatches.map(m => (
                      <div key={m.id} className={`${getTheme(isDarkMode).card} p-3.5 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                        <div>
                          <h4 className="font-bold text-sm">{m.matchName}</h4>
                          <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {m.gameDate}</span>
                            <span>•</span>
                            <span className="text-blue-500 font-medium">{m.competition}</span>
                            <span>•</span>
                            <span className={`${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} px-1.5 py-0.5 rounded text-[10px]`}>{m.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100 border-slate-300'}`}>
                            <UserCheck className="w-3.5 h-3.5 text-blue-500"/> Scout: {m.scout}
                          </div>
                          <button 
                            onClick={() => { setSelectedTeam(null); navigateToMatch(m.id); }}
                            className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-500 text-[10px] md:text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                          >
                            Ir para Jogo <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50 text-center`}>
                    Ainda não foram registados jogos observados desta equipa no Match Center.
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL DETALHADO DO SCOUT (VERSÃO RESTAURADA) */}
      {selectedScout && (() => {
        const scoutMatches = getScoutMatches(selectedScout.name);
        const assignedMarkets = scoutMarketAssignments[selectedScout.id] || [];
        const isAdmin = userRole === 'ADMIN';

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className={`${getTheme(isDarkMode).card} border w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-5 md:p-6 space-y-6 animate-in fade-in zoom-in-95`}>
              
              <div className={`flex justify-between items-start border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-4`}>
                <div className="flex items-center gap-4">
                  {selectedScout.photo ? (
                    <img src={selectedScout.photo} alt={selectedScout.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md flex-shrink-0" />
                  ) : (
                    <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-slate-800 border-blue-500' : 'bg-slate-200 border-blue-500'} border-2 flex items-center justify-center font-bold text-2xl flex-shrink-0`}>
                      {selectedScout.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{selectedScout.name}</h2>
                    <p className="text-xs text-blue-500 font-bold mt-1">{getUserTitle(selectedScout.name)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedScout(null)} className={`p-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} rounded-full text-slate-400 hover:text-white transition`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50`}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Jogos Observados</span>
                  <span className="text-2xl font-black text-emerald-500">{scoutMatches.length}</span>
                </div>
                <div className={`${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50`}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-1 font-semibold`}>Live vs Stream</span>
                  <span className="text-sm font-bold text-blue-500 mt-1 block">{selectedScout.liveMatches || 0} L / {selectedScout.streamMatches || 0} S</span>
                </div>
              </div>

              <div className={`${getTheme(isDarkMode).card} p-4 rounded-xl border border-slate-700/50 space-y-3`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider flex items-center gap-1.5`}>
                    <Globe className="w-3.5 h-3.5 text-blue-500" /> Mercados Atribuídos ({assignedMarkets.length})
                  </h3>
                  {isAdmin && (
                    <span className="text-[10px] text-purple-500 font-bold uppercase">Edição do Head of Scout</span>
                  )}
                </div>

                {isAdmin ? (
                  <CustomMultiSelect 
                    options={getScoutMarketOptions()} 
                    selectedIds={assignedMarkets} 
                    onChange={(ids: string[]) => handleSaveScoutMarkets(selectedScout.id, ids)} 
                    placeholder="Atribuir mercados e séries..." 
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {assignedMarkets.length > 0 ? (
                      assignedMarkets.map((m, idx) => (
                        <span key={idx} className={`text-xs ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'} px-3 py-1 rounded-lg border font-medium`}>
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} italic`}>Nenhum campeonato atribuído a este observador.</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className={`text-xs md:text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-3`}>Histórico de Partidas Acompanhadas ({scoutMatches.length})</h3>
                {scoutMatches.length > 0 ? (
                  <div className="space-y-2.5">
                    {scoutMatches.map(m => (
                      <div key={m.id} className={`${getTheme(isDarkMode).card} p-3.5 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                        <div>
                          <h4 className="font-bold text-sm">{m.matchName}</h4>
                          <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {m.gameDate}</span>
                            <span>•</span>
                            <span className="text-blue-500 font-medium">{m.competition}</span>
                            <span>•</span>
                            <span className={`${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} px-1.5 py-0.5 rounded text-[10px]`}>{m.type}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setSelectedScout(null); navigateToMatch(m.id); }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-500 text-xs font-bold rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          Ir para Jogo <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getTheme(isDarkMode).card} p-6 rounded-xl border border-slate-700/50 text-center`}>
                    Ainda não existem jogos registados em nome deste observador no Match Center.
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </main>
  );
}