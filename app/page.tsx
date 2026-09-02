'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, 
  UserCheck, X, Activity, FileText, BarChart3, Briefcase, Flag, Building2,
  Zap, Crosshair, BrainCircuit, ExternalLink, Globe, Loader2, UserPlus, Trash2, Edit3, CheckCircle2,
  Menu, LayoutDashboard, ArrowRight, Star
} from 'lucide-react';

const TACTICS_OPTIONS = [
  '1-4-3-3', '1-4-4-2', '1-4-2-4', '1-4-1-3-2', '1-4-1-4-1', '1-4-2-3-1', 
  '1-3-5-2', '1-3-4-3', '1-5-4-1', '1-5-3-2'
];

const POSITIONS_OPTIONS = [
  'Center Back', 'Center Midfielder', 'Defensive Midfielder', 'Forward', 
  'Goalkeeper', 'Left Back', 'Left Winger', 'Ofensive Midfielder', 
  'Right Back', 'Right Winger', 'Striker'
];

const METRIC_LEVELS = ['Low', 'Medium', 'High'];

function CustomSelect({
  options, value, onChange, placeholder = 'Selecionar...', searchable = false, className = '',
}: {
  options: Array<{ value: string; label: string; image?: string | null; icon?: React.ReactNode }>;
  value: string; onChange: (val: string) => void; placeholder?: string; searchable?: boolean; className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = searchable
    ? options.filter((o) => (o.label || '').toLowerCase().includes((searchTerm || '').toLowerCase()))
    : options;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 md:p-3.5 text-left text-slate-200 focus:outline-none focus:border-blue-500 flex justify-between items-center text-xs sm:text-sm transition"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.image && <img src={selectedOption.image} alt="" className="w-5 h-5 object-contain rounded-full bg-slate-900" />}
          {selectedOption?.icon && !selectedOption.image && <div className="text-slate-400">{selectedOption.icon}</div>}
          <span className={`truncate ${selectedOption ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-1 bg-[#151c2c]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1 text-xs sm:text-sm">
          {searchable && (
            <div className="p-1 sticky top-0 bg-[#151c2c]/95 z-10 pb-2">
              <input
                type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d131f] border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-slate-500 text-center font-medium">Sem opções</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); setSearchTerm(''); }}
                className={`w-full text-left px-3 py-3 md:py-2.5 rounded-lg transition flex items-center gap-2.5 ${opt.value === value ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'}`}
              >
                {opt.image ? <img src={opt.image} alt="" className="w-6 h-6 object-contain rounded-md bg-slate-900 p-0.5 border border-slate-700" /> : opt.icon ? <span className="text-slate-400">{opt.icon}</span> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />}
                <span className="truncate">{opt.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CustomMultiSelect({
  options, selectedIds, onChange, placeholder = 'Selecionar Scouts...', className = ''
}: {
  options: Array<{ value: string; label: string; image?: string | null }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(item => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedLabels = options.filter(o => selectedIds.includes(o.value)).map(o => o.label);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 md:p-3.5 text-left text-slate-200 focus:outline-none focus:border-blue-500 flex justify-between items-center text-xs sm:text-sm transition min-h-[46px]"
      >
        <span className={selectedLabels.length > 0 ? 'text-slate-200 font-medium truncate' : 'text-slate-500'}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-1 bg-[#151c2c]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl max-h-52 overflow-y-auto p-1.5 space-y-1 text-xs sm:text-sm">
          {options.map((opt) => {
            const isSelected = selectedIds.includes(opt.value);
            return (
              <button
                key={opt.value} type="button"
                onClick={() => toggleOption(opt.value)}
                className={`w-full text-left px-3 py-3 md:py-2.5 rounded-lg transition flex items-center justify-between ${isSelected ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {opt.image ? <img src={opt.image} alt="" className="w-5 h-5 object-contain rounded-full bg-slate-900" /> : <Shield className="w-3.5 h-3.5 text-slate-500"/>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 size={14} className="text-blue-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'players' | 'teams' | 'matches' | 'scouts'>('dashboard');
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [teamFilterStatus, setTeamFilterStatus] = useState('All');
  const [teamFilterComp, setTeamFilterComp] = useState('All');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [editingMatchId, setExpandedMatchEdit] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [profileTab, setProfileTab] = useState<'timeline' | 'algo' | 'market'>('timeline');

  // FORMS
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submittingPre, setSubmittingPre] = useState(false);
  const [preGameData, setPreGameData] = useState({ homeTeamId: '', awayTeamId: '', gameDate: new Date().toISOString().split('T')[0], competitionId: '', scoutIds: [] as string[], type: '' });

  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportData, setReportData] = useState({ homeTactic: '', awayTactic: '', tempo: '', intensity: '', technical: '', pressure: '', notes: '' });

  const [editingHighlight, setEditingHighlight] = useState<{ matchId: string; matchName: string; player: any; highlightId: string | null; notes: string; } | null>(null);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<{ matchId: string; matchName: string } | null>(null);
  const [newHighlightData, setNewHighlightData] = useState({ playerId: '', notes: '' });

  const [isNewPlayerOpen, setIsNewPlayerOpen] = useState(false);
  const [newPlayerData, setNewPlayerData] = useState({ name: '', clubId: '', position: '' });
  const [creatingPlayer, setCreatingPlayer] = useState(false);
  const [availableMatchTeams, setAvailableMatchTeams] = useState<Array<{ id: string; name: string; logo?: string | null }>>([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lecaLogoUrl = "/logo.png";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const [resP, resT, resM, resS] = await Promise.all([
        fetch('/api/players').catch(() => ({ json: () => ({ players: [] }) })),
        fetch('/api/teams').catch(() => ({ json: () => ({ teams: [] }) })),
        fetch('/api/matches').catch(() => ({ json: () => ({ matches: [], competitions: [] }) })),
        fetch('/api/scouts').catch(() => ({ json: () => ({ scouts: [] }) }))
      ]);
      const dataP = await resP.json(); const dataT = await resT.json(); const dataM = await resM.json(); const dataS = await resS.json();
      if (dataP.players) setPlayers(dataP.players);
      if (dataT.teams) setTeams(dataT.teams);
      if (dataM.matches) setMatches(dataM.matches);
      if (dataM.competitions) setCompetitions(dataM.competitions);
      if (dataS.scouts) setScouts(dataS.scouts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // FUNÇÃO GLOBAL DE NAVEGAÇÃO
  const navigateToMatch = (matchId: string) => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
    setActiveTab('matches');
    setExpandedMatchId(matchId);
    // Smooth scroll para garantir que o utilizador vê o topo da lista ou o jogo aberto
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMatch = (id: string) => setExpandedMatchId(expandedMatchId === id ? null : id);

  const startEditMatchContext = (match: any) => {
    setReportData({
      homeTactic: match.homeTactic && match.homeTactic !== '-' ? match.homeTactic : '',
      awayTactic: match.awayTactic && match.awayTactic !== '-' ? match.awayTactic : '',
      tempo: match.tempo && match.tempo !== '-' ? match.tempo : '',
      intensity: match.intensity && match.intensity !== '-' ? match.intensity : '',
      technical: match.technical && match.technical !== '-' ? match.technical : '',
      pressure: match.pressure && match.pressure !== '-' ? match.pressure : '',
      notes: match.notes || '',
    });
    setExpandedMatchEdit(editingMatchId === match.id ? null : match.id);
  };

  const openNewPlayerModalForMatch = (matchName: string) => {
    const matchTeams = teams.filter((t) => (matchName || '').toLowerCase().includes((t.name || '').toLowerCase()));
    setAvailableMatchTeams(matchTeams.length > 0 ? matchTeams : teams);
    setNewPlayerData({ name: '', clubId: matchTeams[0]?.id || '', position: '' });
    setIsNewPlayerOpen(true);
  };

  const handleReportSubmit = async (matchId: string) => {
    setSubmittingReport(true);
    try {
      const res = await fetch('/api/matches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId, ...reportData }), });
      if (res.ok) { setExpandedMatchEdit(null); await loadData(); showToast("Dados coletivos atualizados!"); }
    } catch (err) { console.error(err); } finally { setSubmittingReport(false); }
  };

  const handleSaveSingleHighlight = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingHighlight) return; setSavingHighlight(true);
    try {
      const res = await fetch('/api/highlights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId: editingHighlight.matchId, playerId: editingHighlight.player.id !== editingHighlight.player.name ? editingHighlight.player.id : null, highlightId: editingHighlight.highlightId, notes: editingHighlight.notes, }), });
      if (res.ok) { setEditingHighlight(null); await loadData(); showToast(`Highlight atualizado com sucesso!`); }
    } catch (err) { console.error(err); } finally { setSavingHighlight(false); }
  };

  const handleAddHighlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!isAddHighlightOpen) return;
    try {
      const res = await fetch('/api/highlights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId: isAddHighlightOpen.matchId, playerId: newHighlightData.playerId, notes: newHighlightData.notes, }), });
      if (res.ok) { setIsAddHighlightOpen(null); setNewHighlightData({ playerId: '', notes: '' }); await loadData(); showToast("Novo destaque adicionado!"); }
    } catch (err) { console.error(err); }
  };

  const handlePreGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmittingPre(true);
    try {
      const res = await fetch('/api/matches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preGameData), });
      if (res.ok) { setIsRegisterOpen(false); setPreGameData({ homeTeamId: '', awayTeamId: '', gameDate: new Date().toISOString().split('T')[0], competitionId: '', scoutIds: [], type: '' }); await loadData(); showToast("Jogo agendado com sucesso!"); }
    } catch (err) { console.error(err); } finally { setSubmittingPre(false); }
  };

  const handleCreateNewPlayer = async (e: React.FormEvent) => {
    e.preventDefault(); setCreatingPlayer(true);
    try {
      const res = await fetch('/api/players', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlayerData), });
      const data = await res.json();
      if (res.ok) {
        await loadData();
        if (editingHighlight) setEditingHighlight({ ...editingHighlight, player: { id: data.player.id, name: data.player.name } });
        else if (isAddHighlightOpen) setNewHighlightData({ ...newHighlightData, playerId: data.player.id });
        setIsNewPlayerOpen(false); setNewPlayerData({ name: '', clubId: '', position: '' }); showToast(`Atleta "${data.player.name}" criado!`);
      }
    } catch (err) { console.error(err); } finally { setCreatingPlayer(false); }
  };

  const filteredPlayers = players.filter(p => {
    const query = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(query) || (p.club || '').toLowerCase().includes(query) || (p.position || '').toLowerCase().includes(query);
  });
  
  const displayedPlayers = search ? filteredPlayers : filteredPlayers.slice(0, visibleCount);
  const uniqueTeamComps = Array.from(new Set(teams.map(t => t.competition).filter(c => c !== 'N/D'))).sort();
  const uniqueTeamStatus = Array.from(new Set(teams.map(t => t.status).filter(s => s !== 'N/D'))).sort();

  const filteredTeams = teams.filter(t => {
    const matchSearch = (t.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = teamFilterStatus === 'All' || t.status === teamFilterStatus;
    const matchComp = teamFilterComp === 'All' || t.competition === teamFilterComp;
    return matchSearch && matchStatus && matchComp;
  });

  const getPlayerTimeline = (playerId: string, playerName: string) => {
    const timeline: any[] = [];
    matches.forEach(m => {
      if (m.highlightedPlayers) {
        const found = m.highlightedPlayers.find((p: any) => p.id === playerId || (p.name || '').toLowerCase() === (playerName || '').toLowerCase());
        if (found && found.note && found.note !== 'Sem notas registadas.') {
          timeline.push({ matchId: m.id, matchName: m.matchName, gameDate: m.gameDate, scout: m.scout, note: found.note });
        }
      }
    });
    return timeline.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
  };

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

  const renderMobileMenuButton = (id: typeof activeTab, icon: React.ReactNode, label: string, count?: number) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`flex items-center justify-between w-full p-5 border-b border-slate-800 ${activeTab === id ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
    >
      <div className="flex items-center gap-3">{icon} {label}</div>
      {count !== undefined && <span className="bg-slate-800 px-2 py-0.5 rounded-full text-xs text-slate-400 font-medium">{count}</span>}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#0d131f] text-slate-100 font-sans relative pb-10 md:pb-6">
      
      {toastMessage && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 font-medium text-xs md:text-sm max-w-[90vw] md:max-w-md border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* HEADER WITH LEÇA FC LOGO */}
      <header className="sticky top-0 z-40 bg-[#151c2c]/95 backdrop-blur-md border-b border-slate-800 px-5 py-4 md:p-6 md:m-6 md:rounded-xl md:static flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-center p-1 shadow flex-shrink-0 group">
            <img 
              src={lecaLogoUrl} 
              alt="Leça FC SAD" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-blue-600/20');
              }}
            />
            <Shield className="w-6 h-6 text-blue-400 hidden group-has-[img[style*='display: none']]:block" />
          </div>
          <div>
            <span className="hidden md:block text-[10px] md:text-xs font-semibold tracking-wider text-slate-400 uppercase mb-0.5">Departamento de Scouting</span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">LEÇA FC SAD</h1>
          </div>
        </div>
        
        <button className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {players.length} Atletas na DB
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[76px] z-30 bg-[#0d131f] animate-in slide-in-from-top-2 md:hidden overflow-y-auto">
          {renderMobileMenuButton('dashboard', <LayoutDashboard className="w-5 h-5"/>, 'Início / Painel')}
          {renderMobileMenuButton('players', <Users className="w-5 h-5"/>, 'Base de Jogadores', players.length)}
          {renderMobileMenuButton('teams', <Building2 className="w-5 h-5"/>, 'Equipas', teams.length)}
          {renderMobileMenuButton('matches', <Trophy className="w-5 h-5"/>, 'Match Center', matches.length)}
          {renderMobileMenuButton('scouts', <Shield className="w-5 h-5"/>, 'Equipa de Scouts', scouts.length)}
        </div>
      )}

      {/* DESKTOP TABS */}
      <div className="hidden md:flex max-w-6xl mx-auto mb-6 flex-wrap gap-3 px-6 md:px-0">
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><LayoutDashboard className="w-4 h-4" /> Início</button>
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Users className="w-4 h-4" /> Base de Jogadores ({players.length})</button>
        <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'teams' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Building2 className="w-4 h-4" /> Equipas ({teams.length})</button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Trophy className="w-4 h-4" /> Match Center ({matches.length})</button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Shield className="w-4 h-4" /> Equipa de Scouts ({scouts.length})</button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-4 md:mt-0">
        
        {/* TAB 0: DASHBOARD / INÍCIO */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* WELCOME BANNER & KPIS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-[#151c2c] p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Base de Atletas</span>
                <span className="text-2xl md:text-3xl font-black text-white">{players.length}</span>
                <span className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1"><Activity size={10}/> Atleta(s) Ativos</span>
              </div>
              
              <div className="bg-[#151c2c] p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Jogos Vistos</span>
                <span className="text-2xl md:text-3xl font-black text-blue-400">{matches.length}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-2">Mapeados na Época</span>
              </div>

              <div className="bg-[#151c2c] p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Equipas Mapeadas</span>
                <span className="text-2xl md:text-3xl font-black text-white">{teams.length}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-2">Clubes em BD</span>
              </div>

              <div className="bg-[#151c2c] p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Equipa de Scouts</span>
                <span className="text-2xl md:text-3xl font-black text-emerald-400">{scouts.length}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-2">Observadores</span>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-[#151c2c] p-4 md:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base md:text-lg">Atalhos do Departamento</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ações rápidas para acompanhamento das partidas e prospeção</p>
              </div>
              <div className="flex w-full sm:w-auto gap-3">
                <button onClick={() => setIsRegisterOpen(true)} className="flex-1 sm:flex-none px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                  <Plus className="w-4 h-4" /> Agendar Jogo
                </button>
                <button onClick={() => { setActiveTab('players'); }} className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700">
                  <Search className="w-4 h-4" /> Pesquisar Atleta
                </button>
              </div>
            </div>

            {/* RECENT HIGHLIGHTS FEED */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-400" /> Últimas Observações Submetidas
                </h3>
                <button onClick={() => setActiveTab('matches')} className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1">
                  Ver Todos os Jogos <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRecentHighlights().map((p, idx) => (
                  <div key={idx} className="bg-[#151c2c] border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        {p.photo ? (
                          <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                            {(p.name || 'J').charAt(0)}
                          </div>
                        )}
                        <div>
                          <h5 className="font-bold text-white text-sm">{p.name}</h5>
                          <p className="text-xs text-slate-400 mt-0.5">
                            <span className="text-blue-400 font-medium">{p.position}</span> • {p.club}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-semibold flex items-center gap-1">
                        {p.gameDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0d131f] p-3 rounded-xl border border-slate-800/60 line-clamp-3">
                      {p.note}
                    </p>
                    
                    <button 
                      onClick={() => navigateToMatch(p.matchId)}
                      className="text-[10px] text-blue-400 font-bold hover:underline flex items-center justify-end w-full gap-1 pt-1"
                    >
                      Ir para Jogo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 1: PLAYERS */}
        {activeTab === 'players' && (
          <div className="animate-in fade-in duration-300">
            <div className="relative mb-5 md:mb-6">
              <Search className="absolute left-4 top-4 md:top-3.5 text-slate-500 w-4 h-4 md:w-5 md:h-5" />
              <input type="text" placeholder="Pesquisar atleta, clube, posição..." value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(20); }} className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-4 md:py-3.5 pl-12 pr-4 text-sm md:text-base text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm" />
            </div>

            <div className="flex justify-between items-center mb-4 text-xs md:text-sm text-slate-400">
              <span>A mostrar {displayedPlayers.length} de {filteredPlayers.length} atletas.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {displayedPlayers.map((player) => (
                <div 
                  key={player.id} 
                  onClick={() => { setSelectedPlayer(player); setProfileTab('timeline'); }}
                  className="bg-[#151c2c] border border-slate-800/80 rounded-xl p-4 md:p-5 flex flex-col hover:border-blue-500/50 transition cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-14 h-14 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 bg-slate-800" />
                    ) : (
                      <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-base md:text-sm">
                        {player.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base truncate flex items-center gap-2">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs md:text-[11px] text-slate-400 mt-1 md:mt-0.5 truncate">
                        <span className="text-blue-400 font-medium truncate">{player.position}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-800/60">
                     <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                        {player.clubLogo ? <img src={player.clubLogo} alt={player.club} className="w-4 h-4 md:w-5 md:h-5 object-contain" /> : <Shield className="w-4 h-4 text-slate-500" />}
                        <span className="truncate max-w-[140px] font-medium">{player.club}</span>
                     </div>
                     <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-wide">{player.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {!search && displayedPlayers.length < filteredPlayers.length && (
              <div className="text-center mt-8">
                <button onClick={() => setVisibleCount(prev => prev + 30)} className="w-full md:w-auto px-8 py-4 md:py-3 bg-[#151c2c] hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm md:text-base rounded-xl transition shadow-sm">
                  Ver Mais Atletas
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEAMS */}
        {activeTab === 'teams' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 md:top-3.5 text-slate-500 w-4 h-4 md:w-5 md:h-5" />
                <input type="text" placeholder="Pesquisar equipa..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-4 md:py-3.5 pl-12 pr-4 text-sm md:text-base text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 z-20">
                <CustomSelect options={[{ value: 'All', label: 'Todas as Ligas' }, ...uniqueTeamComps.map(c => ({ value: c, label: c }))]} value={teamFilterComp} onChange={setTeamFilterComp} className="w-full sm:w-48" />
                <CustomSelect options={[{ value: 'All', label: 'Todos Estatutos' }, ...uniqueTeamStatus.map(s => ({ value: s, label: s }))]} value={teamFilterStatus} onChange={setTeamFilterStatus} className="w-full sm:w-48" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {filteredTeams.map((team) => {
                const teamPlayers = players.filter(p => (p.club || '').toLowerCase() === (team.name || '').toLowerCase());
                return (
                  <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-[#151c2c] border border-slate-800 rounded-xl p-4 md:p-5 flex items-center justify-between hover:border-slate-700 transition cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-12 h-12 md:w-14 md:h-14 object-contain p-1.5 bg-slate-900 rounded-lg border border-slate-800 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold flex-shrink-0"><Building2 className="w-6 h-6" /></div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base truncate">{team.name}</h3>
                        <p className="text-xs text-blue-400 font-medium mt-1 truncate">
                          {team.competition && team.competition !== 'N/D' ? team.competition : ''} 
                          {team.competition && team.competition !== 'N/D' && team.country ? <span className="text-slate-500 hidden sm:inline"> • </span> : ''}
                          <span className="text-slate-500 hidden sm:inline">{team.country || ''}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-2">
                       <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-emerald-400 font-bold">{team.totalWatchedMatches} Jogos</span>
                       <span className="text-[10px] text-slate-400 font-medium">{teamPlayers.length} Atletas</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MATCHES (MATCH CENTER) */}
        {activeTab === 'matches' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 md:mb-6">
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Motor de observação de equipas e atletas.</p>
              <button onClick={() => setIsRegisterOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 md:py-3 rounded-xl text-sm md:text-base font-bold transition shadow-lg shadow-blue-900/20">
                <Plus className="w-5 h-5" /> Agendar Jogo
              </button>
            </div>

            <div className="grid gap-3 md:gap-4">
              {matches.map((match) => {
                const isExpanded = expandedMatchId === match.id;
                const isEditingContext = editingMatchId === match.id;

                return (
                  <div key={match.id} className="bg-[#151c2c] border border-slate-800 rounded-xl overflow-hidden transition shadow-sm">
                    <div onClick={() => toggleMatch(match.id)} className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0"><Trophy className="w-5 h-5" /></div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm md:text-base truncate leading-tight mb-1 md:mb-0">{match.matchName}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] md:text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {match.gameDate}</span>
                            {match.competition && match.competition !== 'N/D' && <span className="text-slate-600">•</span>}
                            {match.competition && match.competition !== 'N/D' && <span className="text-blue-400 font-semibold truncate max-w-[120px] md:max-w-none">{match.competition}</span>}
                            <span className="text-slate-600">•</span>
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{match.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0 pl-2">
                        <div className="text-right hidden sm:block">
                          <span className="block text-sm font-bold text-emerald-400">{match.playersCount}</span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Atletas</span>
                        </div>
                        <div className="text-slate-400 bg-slate-800/50 p-2 md:p-1.5 rounded-lg">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 md:p-5 border-t border-slate-800 bg-[#0d131f] md:bg-[#111723] space-y-6 md:space-y-5">
                        
                        {/* MATCH HEADER & METRICS */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#151c2c] md:bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-xs md:text-sm gap-4">
                          <div className="space-y-2 md:space-y-1.5 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-slate-300"><Shield className="w-4 h-4 text-slate-500"/> <strong>Táticas:</strong> {match.homeTactic} / {match.awayTactic}</div>
                            <div className="flex items-center gap-2 text-slate-300"><UserCheck className="w-4 h-4 text-slate-500"/> <strong>Scout:</strong> <span className="text-blue-400 font-medium">{match.scout}</span></div>
                          </div>
                          <button onClick={() => startEditMatchContext(match)} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl md:rounded-lg font-bold hover:bg-blue-600/30 transition">
                            <Edit3 className="w-4 h-4" /> {isEditingContext ? 'Fechar' : 'Editar Táticas'}
                          </button>
                        </div>

                        {/* MATCH CONTEXT EDITOR */}
                        {isEditingContext && (
                          <div className="bg-[#151c2c] md:bg-[#0d131f] p-4 md:p-5 rounded-xl border border-blue-500/30 space-y-4 text-xs md:text-sm shadow-inner animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-blue-400 uppercase tracking-wider mb-2">Editor de Métricas do Jogo</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-400 mb-1.5 font-bold">Tática Casa</label>
                                <CustomSelect options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))} value={reportData.homeTactic} onChange={val => setReportData({ ...reportData, homeTactic: val })} placeholder="Ex: 1-4-3-3" />
                              </div>
                              <div>
                                <label className="block text-slate-400 mb-1.5 font-bold">Tática Fora</label>
                                <CustomSelect options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))} value={reportData.awayTactic} onChange={val => setReportData({ ...reportData, awayTactic: val })} placeholder="Ex: 1-4-3-3" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                              <div><label className="block text-slate-500 mb-1.5 font-bold">Ritmo</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.tempo} onChange={val => setReportData({ ...reportData, tempo: val })} placeholder="-" /></div>
                              <div><label className="block text-slate-500 mb-1.5 font-bold">Físico</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.intensity} onChange={val => setReportData({ ...reportData, intensity: val })} placeholder="-" /></div>
                              <div><label className="block text-slate-500 mb-1.5 font-bold">Técnica</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.technical} onChange={val => setReportData({ ...reportData, technical: val })} placeholder="-" /></div>
                              <div><label className="block text-slate-500 mb-1.5 font-bold">Mental</label><CustomSelect options={METRIC_LEVELS.map(m => ({ value: m, label: m }))} value={reportData.pressure} onChange={val => setReportData({ ...reportData, pressure: val })} placeholder="-" /></div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-2 border-t border-slate-800">
                              <button type="button" onClick={() => setExpandedMatchEdit(null)} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl md:rounded-lg">Cancelar</button>
                              <button type="button" disabled={submittingReport} onClick={() => handleReportSubmit(match.id)} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                {submittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Alterações'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* HIGHLIGHTS SECTION */}
                        <div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                            <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">Avaliações Individuais (Highlights)</h4>
                            <button 
                              onClick={() => { setIsAddHighlightOpen({ matchId: match.id, matchName: match.matchName }); setNewHighlightData({ playerId: '', notes: '' }); }}
                              className="w-full sm:w-auto px-4 py-3 md:py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-bold rounded-xl md:rounded-lg transition flex justify-center items-center gap-2"
                            >
                              <Plus className="w-4 h-4" /> Adicionar Atleta
                            </button>
                          </div>

                          {match.highlightedPlayers && match.highlightedPlayers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {match.highlightedPlayers.map((p: any, idx: number) => {
                                const fullP = players.find(player => (player.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase()) || p;
                                const isUnidentified = fullP.id?.includes('unidentified') || !fullP.id;

                                return (
                                  <div key={p.id || idx} className="bg-[#151c2c] border border-slate-800 p-4 md:p-5 rounded-xl flex flex-col gap-3 shadow-sm relative overflow-hidden group">
                                    {isUnidentified && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>}
                                    
                                    <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                                      <div className="flex items-center gap-3 min-w-0">
                                        {fullP.photo ? (
                                          <img src={fullP.photo} alt={fullP.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0" />
                                        ) : (
                                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm md:text-base flex-shrink-0">
                                            {(fullP.name || 'J').charAt(0)}
                                          </div>
                                        )}
                                        <div className="min-w-0">
                                          <h5 className="font-bold text-white text-sm md:text-base truncate flex items-center gap-1.5">
                                            {fullP.name} 
                                            {isUnidentified && <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] rounded font-bold uppercase">S/Ficha</span>}
                                          </h5>
                                          <p className="text-[11px] md:text-xs text-slate-400 mt-0.5 truncate">
                                            <span className="text-blue-400 font-medium">{fullP.position && fullP.position !== 'N/D' ? fullP.position : 'Atleta'}</span> <span className="hidden sm:inline">• {fullP.club && fullP.club !== 'N/D' ? fullP.club : ''}</span>
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setEditingHighlight({ matchId: match.id, matchName: match.matchName, player: fullP, highlightId: p.highlightId || null, notes: p.note && p.note !== 'Sem notas registadas.' ? p.note : '' }); }}
                                          className="p-2 md:px-2.5 md:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition border border-slate-700 flex items-center justify-center"
                                        >
                                          <Edit3 className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:block">Editar</span>
                                        </button>
                                        {!isUnidentified && (
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedPlayer(fullP); setProfileTab('timeline'); }}
                                            className="p-2 md:px-2.5 md:py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium rounded-lg transition flex items-center justify-center"
                                          >
                                            <Search className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:block">Perfil</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-xs md:text-sm text-slate-300 leading-relaxed bg-[#0d131f] p-3 md:p-4 rounded-lg border border-slate-800/50 font-sans whitespace-pre-wrap">
                                      {p.note || <span className="text-slate-500 italic">Sem nota descritiva registada.</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-xs md:text-sm text-slate-500 bg-[#151c2c] p-8 rounded-xl border border-slate-800 border-dashed text-center flex flex-col items-center gap-2">
                              <UserCheck className="w-8 h-8 text-slate-600 mb-2" />
                              Não existem avaliações individuais registadas neste jogo.
                            </div>
                          )}
                        </div>

                        {/* MÉTRICAS VISUAIS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div className="bg-[#151c2c] p-3 md:p-4 rounded-xl border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"><Zap className="w-3.5 h-3.5"/> Ritmo</span>
                             <span className="text-sm md:text-base font-bold text-white">{match.tempo}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 md:p-4 rounded-xl border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"><Activity className="w-3.5 h-3.5"/> Intensidade</span>
                             <span className="text-sm md:text-base font-bold text-white">{match.intensity}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 md:p-4 rounded-xl border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"><Crosshair className="w-3.5 h-3.5"/> Técnica</span>
                             <span className="text-sm md:text-base font-bold text-white">{match.technical}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 md:p-4 rounded-xl border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"><BrainCircuit className="w-3.5 h-3.5"/> Pressão</span>
                             <span className="text-sm md:text-base font-bold text-white">{match.pressure}</span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SCOUTS */}
        {activeTab === 'scouts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scouts.map((scout) => (
              <div key={scout.id} className="bg-[#151c2c] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  {scout.photo ? (
                    <img src={scout.photo} alt={scout.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xl shadow-md">
                      {scout.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{scout.name}</h3>
                    <p className="text-[10px] md:text-xs text-blue-400 font-medium mt-0.5">Scout do Clube</p>
                  </div>
                </div>

                <div className="bg-[#0d131f] p-3 rounded-lg border border-slate-800/80 mb-4 flex-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-2 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> Mercados (Brevemente)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-500 italic">Definições em desenvolvimento.</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-center pt-3 border-t border-slate-800/60">
                  <div className="flex-1 border-r border-slate-800">
                    <span className="block text-lg font-bold text-emerald-400">{scout.totalMatches || 0}</span>
                    <span className="block text-[8px] md:text-[9px] text-slate-500 uppercase font-bold mt-0.5">Jogos</span>
                  </div>
                  <div className="flex-1 border-r border-slate-800">
                    <span className="block text-lg font-bold text-white">{scout.playersCount || 0}</span>
                    <span className="block text-[8px] md:text-[9px] text-slate-500 uppercase font-bold mt-0.5">Relatórios</span>
                  </div>
                  <div className="flex-1 text-[10px] text-slate-400 space-y-0.5 flex flex-col justify-center">
                    <div><span className="text-blue-400 font-bold">{scout.liveMatches || 0}</span> Live</div>
                    <div><span className="text-slate-300 font-bold">{scout.streamMatches || 0}</span> Vídeo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --------------------- MODALS CENTRADOS --------------------- */}

      {/* MODAL EDITAR HIGHLIGHT INDIVIDUAL */}
      {editingHighlight && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                {editingHighlight.player.photo ? (
                  <img src={editingHighlight.player.photo} alt={editingHighlight.player.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-700 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm md:text-base flex-shrink-0">
                    {(editingHighlight.player.name || 'J').charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm md:text-base truncate">Editar: {editingHighlight.player.name}</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 truncate">{editingHighlight.matchName}</p>
                </div>
              </div>
              <button onClick={() => setEditingHighlight(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSingleHighlight} className="space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-slate-400 font-bold mb-2">Relatório Individual</label>
                <textarea 
                  rows={6} required placeholder="Escreve a tua avaliação técnica/tática..."
                  value={editingHighlight.notes} onChange={e => setEditingHighlight({ ...editingHighlight, notes: e.target.value })}
                  className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800 mt-4">
                <button type="button" onClick={() => setEditingHighlight(null)} className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancelar</button>
                <button type="submit" disabled={savingHighlight} className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                  {savingHighlight ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Observação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR HIGHLIGHT */}
      {isAddHighlightOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base md:text-sm">Adicionar Atleta</h3>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 truncate max-w-[250px]">{isAddHighlightOpen.matchName}</p>
              </div>
              <button onClick={() => setIsAddHighlightOpen(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddHighlightSubmit} className="space-y-4 text-sm md:text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-400 font-bold">Procurar na Base de Dados</label>
                  <button type="button" onClick={() => openNewPlayerModalForMatch(isAddHighlightOpen.matchName)} className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1 font-bold text-[10px] md:text-xs">
                    <UserPlus className="w-3 h-3" /> Novo Atleta
                  </button>
                </div>
                <CustomSelect
                  options={players.map(p => ({ value: p.id, label: `${p.name} (${p.position})`, image: p.photo }))}
                  value={newHighlightData.playerId} onChange={val => setNewHighlightData({ ...newHighlightData, playerId: val })}
                  placeholder="Pesquisar atleta..." searchable={true}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Relatório</label>
                <textarea 
                  rows={4} required placeholder="Análise individual do atleta..."
                  value={newHighlightData.notes} onChange={e => setNewHighlightData({ ...newHighlightData, notes: e.target.value })}
                  className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3.5 text-slate-200 font-sans focus:outline-none focus:border-blue-500 resize-none shadow-inner"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800 mt-4">
                <button type="button" onClick={() => setIsAddHighlightOpen(null)} className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">Adicionar Destaque</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRÉ-JOGO (COM MULTI-SELEÇÃO DE SCOUTS) */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl"><Trophy className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white">Agendar Novo Jogo</h2>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Criar partida na agenda</p>
                </div>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handlePreGameSubmit} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Equipa Casa</label>
                  <CustomSelect options={teams.map(t => ({ value: t.id, label: t.name, image: t.logo }))} value={preGameData.homeTeamId} onChange={val => setPreGameData({ ...preGameData, homeTeamId: val })} placeholder="Procurar..." searchable={true} />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Equipa Visitante</label>
                  <CustomSelect options={teams.map(t => ({ value: t.id, label: t.name, image: t.logo }))} value={preGameData.awayTeamId} onChange={val => setPreGameData({ ...preGameData, awayTeamId: val })} placeholder="Procurar..." searchable={true} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Data do Jogo</label>
                  <input type="date" required value={preGameData.gameDate} onChange={e => setPreGameData({ ...preGameData, gameDate: e.target.value })} className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Tipo de Observação</label>
                  <CustomSelect options={[{ value: '🏟️ Live', label: 'Live', icon: '🏟️' }, { value: '💻 Stream', label: 'Stream', icon: '💻' }]} value={preGameData.type} onChange={val => setPreGameData({ ...preGameData, type: val })} placeholder="Selecionar..." />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Scouts Observadores (Seleção Múltipla)</label>
                <CustomMultiSelect 
                  options={scouts.map(s => ({ value: s.id, label: s.name, image: s.photo }))} 
                  selectedIds={preGameData.scoutIds} 
                  onChange={ids => setPreGameData({ ...preGameData, scoutIds: ids })} 
                  placeholder="Selecionar Scouts que acompanharam o jogo..." 
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Competição / Liga</label>
                <CustomSelect options={competitions.map(c => ({ value: c.id, label: c.name }))} value={preGameData.competitionId} onChange={val => setPreGameData({ ...preGameData, competitionId: val })} placeholder="Procurar Competição..." searchable={true} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setIsRegisterOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancelar</button>
                <button type="submit" disabled={submittingPre} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                  {submittingPre ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Agendar Jogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINI-MODAL: CRIAR NOVO ATLETA */}
      {isNewPlayerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base md:text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" /> Criar Atleta
              </h3>
              <button onClick={() => setIsNewPlayerOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateNewPlayer} className="space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">Nome Completo</label>
                <input type="text" required value={newPlayerData.name} onChange={e => setNewPlayerData({ ...newPlayerData, name: e.target.value })} className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">Clube Atual (Filtrado pelo Jogo)</label>
                <CustomSelect options={(availableMatchTeams.length > 0 ? availableMatchTeams : teams).map(t => ({ value: t.id, label: t.name, image: t.logo }))} value={newPlayerData.clubId} onChange={val => setNewPlayerData({ ...newPlayerData, clubId: val })} placeholder="Selecionar Clube..." searchable={true} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">Posição Principal</label>
                <CustomSelect options={POSITIONS_OPTIONS.map(pos => ({ value: pos, label: pos }))} value={newPlayerData.position} onChange={val => setNewPlayerData({ ...newPlayerData, position: val })} placeholder="Selecionar..." searchable={true} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800 mt-4">
                <button type="button" onClick={() => setIsNewPlayerOpen(false)} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl">Voltar</button>
                <button type="submit" disabled={creatingPlayer} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20">
                  {creatingPlayer ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Atleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERFIL DETALHADO DO JOGADOR */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="bg-[#151c2c] border-b border-slate-800 p-5 md:p-8 flex-shrink-0 relative">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition z-10"><X className="w-5 h-5" /></button>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mt-2 md:mt-0">
                {selectedPlayer.photo ? (
                  <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-[#0d131f] shadow-xl bg-[#0d131f]" />
                ) : (
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-[#0d131f] border-4 border-slate-800 flex items-center justify-center text-slate-400 font-bold text-3xl shadow-xl">
                    {(selectedPlayer.name || 'J').charAt(0)}
                  </div>
                )}
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-xl md:text-3xl font-black text-white mb-2 tracking-tight">{selectedPlayer.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <span className="bg-blue-600 text-white px-3 py-1 md:py-1.5 rounded-lg font-bold shadow-md shadow-blue-900/20">{selectedPlayer.position}</span>
                    <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 md:py-1.5 rounded-lg border border-slate-700 text-slate-200 font-medium">
                      {selectedPlayer.clubLogo ? <img src={selectedPlayer.clubLogo} alt={selectedPlayer.club} className="w-4 h-4 md:w-5 md:h-5 object-contain" /> : <Shield className="w-4 h-4 text-blue-400" />}
                      <span className="truncate max-w-[120px] md:max-w-none">{selectedPlayer.club}</span>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 md:py-1.5 rounded-lg font-bold uppercase tracking-wide flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" /> {selectedPlayer.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0d131f] p-4 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                <div className="bg-[#151c2c] p-4 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Idade</span>
                  <span className="text-white text-lg font-black">{selectedPlayer.age !== 'N/D' ? `${selectedPlayer.age} anos` : '--'}</span>
                </div>
                <div className="bg-[#151c2c] p-4 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Nacionalidade</span>
                  <span className="text-white text-base md:text-lg font-black flex items-center justify-center md:justify-start gap-1.5 truncate w-full"><Flag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"/> <span className="truncate">{selectedPlayer.nationality || '--'}</span></span>
                </div>
                <div className="bg-[#151c2c] p-4 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Pé / Altura</span>
                  <span className="text-white text-lg font-black">{selectedPlayer.foot || '-'} • {selectedPlayer.height || '-'}</span>
                </div>
                <div className="bg-[#151c2c] p-4 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col justify-center items-center md:items-start text-center md:text-left bg-blue-900/10 border-blue-900/30">
                  <span className="text-blue-500/70 text-[10px] uppercase font-bold tracking-widest block mb-1">Jogos Vistos</span>
                  <span className="text-blue-400 text-2xl font-black">{getPlayerTimeline(selectedPlayer.id, selectedPlayer.name).length}</span>
                </div>
              </div>

              <div className="flex gap-4 md:gap-8 border-b border-slate-800 text-xs md:text-sm font-bold mb-6 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => setProfileTab('timeline')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'timeline' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'}`}>
                  <FileText className="w-4 h-4" /> Relatórios & Timeline
                </button>
                <button onClick={() => setProfileTab('algo')} className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${profileTab === 'algo' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'}`}>
                  <BarChart3 className="w-4 h-4" /> Looker Studio (Algoritmo)
                </button>
              </div>

              {profileTab === 'timeline' && (
                <div className="space-y-6">
                  {getPlayerTimeline(selectedPlayer.id, selectedPlayer.name).length > 0 ? (
                    <div className="relative border-l-2 border-slate-800/80 ml-3 md:ml-4 space-y-8 pb-4">
                      {getPlayerTimeline(selectedPlayer.id, selectedPlayer.name).map((report, idx) => (
                        <div key={idx} className="relative pl-6 md:pl-8">
                          <div className="absolute w-4 h-4 bg-blue-500 rounded-full left-[-9px] top-1 border-4 border-[#0d131f] shadow-sm"></div>
                          <div className="bg-[#151c2c] p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-800/60 pb-3">
                              <div>
                                <h4 className="font-bold text-white text-sm md:text-base leading-tight">{report.matchName}</h4>
                                <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 mt-1">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {report.gameDate}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <div className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-slate-300">
                                  <UserCheck className="w-3 h-3 text-blue-400"/> Scout: {report.scout}
                                </div>
                                <button 
                                  onClick={() => navigateToMatch(report.matchId)}
                                  className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-[10px] md:text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                                >
                                  Ir para Jogo <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                              {report.note}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#151c2c] rounded-2xl border border-slate-800 border-dashed">
                      <FileText className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                      <p className="text-sm text-slate-400 font-medium">Ainda não existem relatórios de jogo para este atleta.</p>
                      <p className="text-xs text-slate-500 mt-1">As observações individuais feitas no Match Center aparecerão aqui.</p>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'algo' && (
                <div className="flex flex-col items-center justify-center py-20 bg-blue-900/5 rounded-2xl border border-blue-900/20 text-center px-4">
                  <BarChart3 className="w-12 h-12 text-blue-500/50 mb-4" />
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Integração Looker Studio</h3>
                  <p className="text-sm text-slate-400 max-w-md">Em breve, a avaliação do algoritmo e os gráficos de rating gerados pelo vosso sistema em Excel estarão incorporados nesta vista.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL PERFIL EQUIPA (PADRONIZADO E COM JOGOS OBSERVADOS) */}
      {selectedTeam && (() => {
        const teamPlayers = players.filter(p => (p.club || '').toLowerCase() === (selectedTeam.name || '').toLowerCase());
        const teamMatches = matches.filter(m => (m.matchName || '').toLowerCase().includes((selectedTeam.name || '').toLowerCase()));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#151c2c] border border-slate-800 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-5 md:p-6 space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-4">
                  {selectedTeam.logo ? (
                    <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-14 h-14 md:w-16 md:h-16 object-contain p-1.5 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                      <Building2 className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{selectedTeam.name}</h2>
                    <p className="text-xs text-blue-400 font-medium mt-1">
                      {selectedTeam.competition && selectedTeam.competition !== 'N/D' ? selectedTeam.competition : ''}
                      {selectedTeam.competition && selectedTeam.competition !== 'N/D' && selectedTeam.country ? <span className="text-slate-500"> • </span> : ''}
                      {selectedTeam.country && <span className="text-slate-400">{selectedTeam.country}</span>}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-semibold">Jogos Observados</span>
                  <span className="text-xl font-bold text-emerald-400">{teamMatches.length} Partidas</span>
                </div>
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-semibold">Estatuto de Observação</span>
                  <span className="text-xl font-bold text-blue-400">{selectedTeam.status || 'Monitored'}</span>
                </div>
              </div>

              {/* Atletas do Clube */}
              <div>
                <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Atletas de Interesse na Base de Dados ({teamPlayers.length})</h3>
                {teamPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {teamPlayers.map(p => (
                      <div key={p.id} className="bg-[#0d131f] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          {p.photo ? (
                            <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs flex-shrink-0">
                              {(p.name || 'J').charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                            <p className="text-xs text-blue-400 font-medium mt-0.5 truncate">{p.position}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTeam(null);
                            setSelectedPlayer(p);
                            setProfileTab('timeline');
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg transition flex-shrink-0 ml-2"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-center">
                    Ainda não existem atletas desta equipa registados na base de dados.
                  </div>
                )}
              </div>

              {/* Histórico de Jogos Observados */}
              <div>
                <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Histórico de Jogos Observados ({teamMatches.length})</h3>
                {teamMatches.length > 0 ? (
                  <div className="space-y-2.5">
                    {teamMatches.map(m => (
                      <div key={m.id} className="bg-[#0d131f] p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-sm">{m.matchName}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {m.gameDate}</span>
                            <span>•</span>
                            <span className="text-blue-400 font-medium">{m.competition}</span>
                            <span>•</span>
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">{m.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className="bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-400"/> Scout: {m.scout}
                          </div>
                          <button 
                            onClick={() => navigateToMatch(m.id)}
                            className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                          >
                            Ir para Jogo <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-center">
                    Ainda não foram registados jogos observados desta equipa no Match Center.
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