'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, 
  UserCheck, X, Activity, Ruler, FileText, BarChart3, Briefcase, Flag, Building2,
  Zap, Crosshair, BrainCircuit, ExternalLink, Globe, Loader2, UserPlus, Trash2, Edit3, CheckCircle2
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

// COMPONENTE DROPDOWN PERSONALIZADO COM O DESIGN DA APP
function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecionar...',
  searchable = false,
  className = '',
}: {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
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
    ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-left text-slate-200 focus:outline-none focus:border-blue-500 flex justify-between items-center text-xs transition"
      >
        <span className={selectedOption ? 'text-slate-200 font-medium' : 'text-slate-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-1 bg-[#151c2c] border border-slate-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto p-1.5 space-y-1 text-xs">
          {searchable && (
            <div className="p-1 sticky top-0 bg-[#151c2c] z-10 pb-2">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d131f] border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          {filteredOptions.length === 0 ? (
            <div className="p-2.5 text-slate-500 text-center">Sem opções disponíveis</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  opt.value === value
                    ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'matches' | 'scouts'>('players');
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  
  const [teamFilterStatus, setTeamFilterStatus] = useState('All');
  const [teamFilterComp, setTeamFilterComp] = useState('All');
  
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [editingMatchId, setExpandedMatchEdit] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [profileTab, setProfileTab] = useState<'timeline' | 'algo' | 'market'>('timeline');

  // MODAL PRÉ-JOGO
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submittingPre, setSubmittingPre] = useState(false);
  const [preGameData, setPreGameData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    gameDate: new Date().toISOString().split('T')[0],
    competitionId: '',
    scoutId: '',
    type: '🏟️ Live',
  });

  // WORKSPACE CONTEXTO DO JOGO
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportData, setReportData] = useState({
    homeTactic: '',
    awayTactic: '',
    tempo: '',
    intensity: '',
    technical: '',
    pressure: '',
    notes: '',
  });

  // MODAL DE EDIÇÃO INDIVIDUAL DE HIGHLIGHT DE UM JOGADOR
  const [editingHighlight, setEditingHighlight] = useState<{
    matchId: string;
    matchName: string;
    player: any;
    highlightId: string | null;
    notes: string;
  } | null>(null);
  const [savingHighlight, setSavingHighlight] = useState(false);

  // MODAL ADICIONAR NOVO HIGHLIGHT A UM JOGO
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<{ matchId: string; matchName: string } | null>(null);
  const [newHighlightData, setNewHighlightData] = useState({ playerId: '', notes: '' });

  // MINI-MODAL NOVO ATLETA
  const [isNewPlayerOpen, setIsNewPlayerOpen] = useState(false);
  const [newPlayerData, setNewPlayerData] = useState({ name: '', clubId: '', position: '' });
  const [creatingPlayer, setCreatingPlayer] = useState(false);
  const [availableMatchTeams, setAvailableMatchTeams] = useState<Array<{ id: string; name: string }>>([]);

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
      
      const dataP = await resP.json();
      const dataT = await resT.json();
      const dataM = await resM.json();
      const dataS = await resS.json();

      if (dataP.players) setPlayers(dataP.players);
      if (dataT.teams) setTeams(dataT.teams);
      if (dataM.matches) setMatches(dataM.matches);
      if (dataM.competitions) setCompetitions(dataM.competitions);
      if (dataS.scouts) setScouts(dataS.scouts);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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

  // APENAS AS EQUIPAS DO JOGO NO MODAL DE NOVO ATLETA
  const openNewPlayerModalForMatch = (matchName: string) => {
    const matchTeams = teams.filter((t) => matchName.toLowerCase().includes(t.name.toLowerCase()));
    setAvailableMatchTeams(matchTeams.length > 0 ? matchTeams : teams);
    setNewPlayerData({ name: '', clubId: matchTeams[0]?.id || '', position: '' });
    setIsNewPlayerOpen(true);
  };

  // SUBMETER APENAS DADOS COLETIVOS DO JOGO
  const handleReportSubmit = async (matchId: string) => {
    setSubmittingReport(true);

    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, ...reportData }),
      });

      const resData = await res.json();

      if (res.ok) {
        setExpandedMatchEdit(null);
        await loadData();
        showToast("Dados do jogo atualizados!");
      } else {
        alert(`Erro Airtable: ${resData.error || 'Falha ao atualizar jogo.'}`);
      }
    } catch (err) {
      console.error("Erro ao submeter relatório do jogo", err);
    } finally {
      setSubmittingReport(false);
    }
  };

  // SUBMETER HIGHLIGHT INDIVIDUAL DE UM JOGADOR
  const handleSaveSingleHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHighlight) return;
    setSavingHighlight(true);

    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: editingHighlight.matchId,
          playerId: editingHighlight.player.id,
          highlightId: editingHighlight.highlightId,
          notes: editingHighlight.notes,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditingHighlight(null);
        await loadData();
        showToast(`Highlight de ${editingHighlight.player.name} guardado!`);
      } else {
        alert(`Erro ao guardar highlight: ${data.error}`);
      }
    } catch (err) {
      console.error("Erro ao guardar highlight", err);
    } finally {
      setSavingHighlight(false);
    }
  };

  // CRIAR NOVO HIGHLIGHT DE JOGADOR
  const handleAddHighlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddHighlightOpen) return;

    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: isAddHighlightOpen.matchId,
          playerId: newHighlightData.playerId,
          notes: newHighlightData.notes,
        }),
      });

      if (res.ok) {
        setIsAddHighlightOpen(null);
        setNewHighlightData({ playerId: '', notes: '' });
        await loadData();
        showToast("Novo destaque adicionado ao jogo!");
      }
    } catch (err) {
      console.error("Erro ao criar highlight", err);
    }
  };

  // SUBMETER PRÉ-JOGO
  const handlePreGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPre(true);

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preGameData),
      });

      const resData = await res.json();

      if (res.ok) {
        setIsRegisterOpen(false);
        setPreGameData({
          homeTeamId: '', awayTeamId: '', gameDate: new Date().toISOString().split('T')[0],
          competitionId: '', scoutId: '', type: '🏟️ Live',
        });
        await loadData();
        showToast("Jogo agendado com sucesso!");
      } else {
        alert(`Erro Airtable: ${resData.error || 'Falha ao agendar jogo.'}`);
      }
    } catch (err) {
      console.error("Erro ao agendar jogo", err);
    } finally {
      setSubmittingPre(false);
    }
  };

  // CRIAR NOVO JOGADOR
  const handleCreateNewPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPlayer(true);

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayerData),
      });

      const data = await res.json();

      if (res.ok) {
        await loadData();
        if (editingHighlight) {
          setEditingHighlight({ ...editingHighlight, player: { id: data.player.id, name: data.player.name } });
        } else if (isAddHighlightOpen) {
          setNewHighlightData({ ...newHighlightData, playerId: data.player.id });
        }
        setIsNewPlayerOpen(false);
        setNewPlayerData({ name: '', clubId: '', position: '' });
        showToast(`Atleta "${data.player.name}" criado com sucesso!`);
      } else {
        alert(`Erro Airtable Players: ${data.error || 'Falha ao criar atleta.'}`);
      }
    } catch (err) {
      console.error("Erro ao criar jogador", err);
    } finally {
      setCreatingPlayer(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const query = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(query) || 
           (p.club || '').toLowerCase().includes(query) || 
           (p.position || '').toLowerCase().includes(query);
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

  return (
    <main className="min-h-screen bg-[#0d131f] text-slate-100 p-6 font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 font-medium text-xs">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-[#151c2c] p-6 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Departamento de Scouting & Prospecção</span>
          <h1 className="text-2xl font-bold text-white tracking-wide">LEÇA FC SAD</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {players.length} Atletas em Live DB
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-3">
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Users size={16} /> Base de Jogadores ({players.length})</button>
        <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Building2 size={16} /> Equipas ({teams.length})</button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Trophy size={16} /> Matches ({matches.length})</button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Shield size={16} /> Equipa de Scouts ({scouts.length})</button>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* TAB 1: PLAYERS */}
        {activeTab === 'players' && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input type="text" placeholder="Pesquisar por nome, clube ou posição..." value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(30); }} className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
              <span>A mostrar {displayedPlayers.length} de {filteredPlayers.length} atletas.</span>
            </div>

            <div className="grid gap-3">
              {displayedPlayers.map((player) => (
                <div 
                  key={player.id} 
                  onClick={() => { setSelectedPlayer(player); setProfileTab('timeline'); }}
                  className="bg-[#151c2c] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                        {player.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white text-base flex items-center gap-2">
                        {player.name}
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-normal">{player.status}</span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-blue-400 font-medium">{player.position}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          {player.clubLogo ? (
                            <img src={player.clubLogo} alt={player.club} className="w-3.5 h-3.5 object-contain" />
                          ) : (
                            <Shield className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{player.club}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      setSelectedPlayer(player); 
                      setProfileTab('timeline'); 
                    }} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition shadow-md"
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              ))}
            </div>

            {!search && displayedPlayers.length < filteredPlayers.length && (
              <div className="text-center mt-6">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 30)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-xl transition shadow-md"
                >
                  Carregar Mais Atletas (+30)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEAMS */}
        {activeTab === 'teams' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input type="text" placeholder="Pesquisar equipa..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-4">
                <CustomSelect
                  options={[{ value: 'All', label: 'Todas as Competições' }, ...uniqueTeamComps.map(c => ({ value: c, label: c }))]}
                  value={teamFilterComp}
                  onChange={setTeamFilterComp}
                  className="w-48"
                />
                <CustomSelect
                  options={[{ value: 'All', label: 'Todos os Estatutos' }, ...uniqueTeamStatus.map(s => ({ value: s, label: s }))]}
                  value={teamFilterStatus}
                  onChange={setTeamFilterStatus}
                  className="w-48"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeams.map((team) => {
                const teamPlayers = players.filter(p => p.club.toLowerCase() === team.name.toLowerCase());
                return (
                  <div key={team.id} className="bg-[#151c2c] border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition">
                    <div className="flex items-center gap-4">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain p-1 bg-slate-900 rounded-lg border border-slate-800" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold"><Building2 size={22} /></div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{team.name}</h3>
                        <p className="text-xs text-blue-400 font-medium mt-0.5">{team.competition} • <span className="text-slate-400 font-normal">{team.country}</span></p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-emerald-400 font-medium">{team.totalWatchedMatches} Jogos Vistos</span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{teamPlayers.length} Jogadores na BD</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedTeam(team)} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-700">
                      Ver Equipa
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MATCHES */}
        {activeTab === 'matches' && (
          <div className="grid gap-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-400">Histórico de partidas observadas e atletas referenciados.</p>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg"
              >
                <Plus size={16} /> Agendar Jogo (Pré-Jogo)
              </button>
            </div>

            <div className="grid gap-3">
              {matches.map((match) => {
                const isExpanded = expandedMatchId === match.id;
                const isEditingContext = editingMatchId === match.id;

                return (
                  <div key={match.id} className="bg-[#151c2c] border border-slate-800 rounded-xl overflow-hidden transition hover:border-slate-700">
                    <div onClick={() => toggleMatch(match.id)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Trophy size={22} /></div>
                        <div>
                          <h3 className="font-semibold text-white text-base">{match.matchName}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-slate-300"><Calendar size={12} /> {match.gameDate}</span>
                            <span>•</span>
                            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold">{match.competition}</span>
                            <span>•</span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{match.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-sm font-bold text-emerald-400">{match.playersCount} Jogadores</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Destacados</span>
                        </div>
                        <div className="text-slate-400">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800 bg-[#111723] space-y-5">
                        
                        {/* CABEÇALHO DO JOGO E BOTÃO DE CONTEXTO COLETIVO */}
                        <div className="flex justify-between items-center bg-[#0d131f] p-4 rounded-lg border border-slate-800 text-xs">
                          <div className="space-y-1">
                            <div><strong>Scout Observador:</strong> {match.scout}</div>
                            <div className="text-slate-400">Táticas: Casa ({match.homeTactic}) vs Visitante ({match.awayTactic})</div>
                          </div>
                          <button 
                            onClick={() => startEditMatchContext(match)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg font-medium hover:bg-blue-600/30 transition"
                          >
                            <Edit3 size={14} /> {isEditingContext ? 'Fechar Edição' : 'Editar Métricas do Jogo'}
                          </button>
                        </div>

                        {/* EDITAR APENAS MÉTRICAS E TÁTICAS COLETIVAS DA PARTIDA */}
                        {isEditingContext && (
                          <div className="bg-[#0d131f] p-5 rounded-xl border border-blue-500/30 space-y-4 text-xs">
                            <h4 className="font-bold text-blue-400 uppercase tracking-wider">Métricas & Táticas da Partida</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-400 mb-1 font-semibold">Tática Equipa Casa</label>
                                <CustomSelect
                                  options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))}
                                  value={reportData.homeTactic}
                                  onChange={val => setReportData({ ...reportData, homeTactic: val })}
                                  placeholder="Selecionar Tática Casa..."
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 mb-1 font-semibold">Tática Equipa Visitante</label>
                                <CustomSelect
                                  options={TACTICS_OPTIONS.map(t => ({ value: t, label: t }))}
                                  value={reportData.awayTactic}
                                  onChange={val => setReportData({ ...reportData, awayTactic: val })}
                                  placeholder="Selecionar Tática Visitante..."
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                              <div>
                                <label className="block text-slate-500 mb-1 font-medium">Ritmo de Jogo</label>
                                <CustomSelect
                                  options={METRIC_LEVELS.map(m => ({ value: m, label: m }))}
                                  value={reportData.tempo}
                                  onChange={val => setReportData({ ...reportData, tempo: val })}
                                  placeholder="Selecionar..."
                                />
                              </div>
                              <div>
                                <label className="block text-slate-500 mb-1 font-medium">Intensidade Física</label>
                                <CustomSelect
                                  options={METRIC_LEVELS.map(m => ({ value: m, label: m }))}
                                  value={reportData.intensity}
                                  onChange={val => setReportData({ ...reportData, intensity: val })}
                                  placeholder="Selecionar..."
                                />
                              </div>
                              <div>
                                <label className="block text-slate-500 mb-1 font-medium">Qualidade Técnica</label>
                                <CustomSelect
                                  options={METRIC_LEVELS.map(m => ({ value: m, label: m }))}
                                  value={reportData.technical}
                                  onChange={val => setReportData({ ...reportData, technical: val })}
                                  placeholder="Selecionar..."
                                />
                              </div>
                              <div>
                                <label className="block text-slate-500 mb-1 font-medium">Pressão Mental</label>
                                <CustomSelect
                                  options={METRIC_LEVELS.map(m => ({ value: m, label: m }))}
                                  value={reportData.pressure}
                                  onChange={val => setReportData({ ...reportData, pressure: val })}
                                  placeholder="Selecionar..."
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button type="button" onClick={() => setExpandedMatchEdit(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancelar</button>
                              <button type="button" disabled={submittingReport} onClick={() => handleReportSubmit(match.id)} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2">
                                {submittingReport ? <Loader2 size={14} className="animate-spin" /> : 'Guardar Dados do Jogo'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* SECÇÃO DE ATLETAS E AVALIAÇÕES INDIVIDUAIS */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atletas Referenciados & Observações Individuais</h4>
                            <button 
                              onClick={() => {
                                setIsAddHighlightOpen({ matchId: match.id, matchName: match.matchName });
                                setNewHighlightData({ playerId: '', notes: '' });
                              }}
                              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition flex items-center gap-1"
                            >
                              <Plus size={14} /> + Adicionar Destaque a este Jogo
                            </button>
                          </div>

                          {match.highlightedPlayers && match.highlightedPlayers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {match.highlightedPlayers.map((p: any, idx: number) => {
                                const fullP = players.find(player => (player.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase()) || p;

                                return (
                                  <div 
                                    key={p.id || idx}
                                    className="bg-[#151c2c] border border-slate-800 p-4 rounded-xl space-y-3 hover:border-slate-700 transition"
                                  >
                                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                                      <div className="flex items-center gap-3">
                                        {fullP.photo ? (
                                          <img src={fullP.photo} alt={fullP.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" />
                                        ) : (
                                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                                            {(fullP.name || 'J').charAt(0)}
                                          </div>
                                        )}
                                        <div>
                                          <h5 className="font-semibold text-white text-sm">{fullP.name}</h5>
                                          <p className="text-xs text-slate-400 mt-0.5">
                                            <span className="text-blue-400 font-medium">{fullP.position && fullP.position !== 'N/D' ? fullP.position : 'Atleta'}</span> • {fullP.club && fullP.club !== 'N/D' ? fullP.club : 'Clube N/D'}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingHighlight({
                                              matchId: match.id,
                                              matchName: match.matchName,
                                              player: fullP,
                                              highlightId: p.highlightId || null,
                                              notes: p.note && p.note !== 'Sem notas registadas.' ? p.note : ''
                                            });
                                          }}
                                          className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition flex items-center gap-1"
                                        >
                                          <Edit3 size={12} /> Editar Highlight
                                        </button>

                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPlayer(fullP);
                                            setProfileTab('timeline');
                                          }}
                                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition border border-slate-700 flex items-center gap-1"
                                        >
                                          Ver Perfil <ExternalLink size={12} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="text-xs text-slate-300 leading-relaxed bg-[#0d131f] p-3 rounded-lg border border-slate-800/80 font-sans whitespace-pre-line">
                                      {p.note || 'Sem nota registada.'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 bg-[#0d131f] p-4 rounded-lg border border-slate-800 text-center">
                              Ainda não existem atletas destacados para este jogo.
                            </div>
                          )}
                        </div>

                        {/* MÉTRICAS VISUAIS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div className="bg-[#151c2c] p-3 rounded-lg border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1"><Zap size={12}/> Ritmo de Jogo</span>
                             <span className="text-sm font-medium text-white">{match.tempo}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 rounded-lg border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1"><Activity size={12}/> Intensidade Física</span>
                             <span className="text-sm font-medium text-white">{match.intensity}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 rounded-lg border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1"><Crosshair size={12}/> Qualidade Técnica</span>
                             <span className="text-sm font-medium text-white">{match.technical}</span>
                          </div>
                          <div className="bg-[#151c2c] p-3 rounded-lg border border-slate-800/60">
                             <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1"><BrainCircuit size={12}/> Pressão Mental</span>
                             <span className="text-sm font-medium text-white">{match.pressure}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scouts.map((scout) => (
              <div key={scout.id} className="bg-[#151c2c] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 border-b border-slate-800/60 pb-4 mb-4">
                    {scout.photo ? (
                      <img src={scout.photo} alt={scout.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 shadow-md" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xl shadow-md">
                        {scout.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg">{scout.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Scout do Departamento</p>
                    </div>
                  </div>

                  <div className="bg-[#0d131f] p-3.5 rounded-lg border border-slate-800/80 mb-4">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2 flex items-center gap-1">
                      <Globe size={12} className="text-blue-400" /> Competições Atribuídas / Mercados (Admin)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(scout.competitions) ? scout.competitions.map((comp: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-xs font-semibold">
                          {comp}
                        </span>
                      )) : (
                        <span className="text-xs text-slate-500">Sem mercados atribuídos</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-center pt-2 border-t border-slate-800/60">
                  <div className="flex-1 border-r border-slate-800">
                    <span className="block text-xl font-bold text-emerald-400">{scout.totalMatches}</span>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider mt-1">Jogos Vistos</span>
                  </div>
                  <div className="flex-1 border-r border-slate-800">
                    <span className="block text-xl font-bold text-white">{scout.playersCount}</span>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider mt-1">Atletas Reportados</span>
                  </div>
                  <div className="flex-1 text-xs text-slate-400 space-y-1">
                    <div className="flex justify-center items-center gap-1"><span className="text-blue-400 font-semibold">{scout.liveMatches}</span> Live</div>
                    <div className="flex justify-center items-center gap-1"><span className="text-slate-300 font-semibold">{scout.streamMatches}</span> Stream</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL FOCADO EM EDITAR O HIGHLIGHT DE UM UNICO JOGADOR */}
      {editingHighlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                {editingHighlight.player.photo ? (
                  <img src={editingHighlight.player.photo} alt={editingHighlight.player.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-base">
                    {(editingHighlight.player.name || 'J').charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-base">Editar Highlight: {editingHighlight.player.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{editingHighlight.matchName}</p>
                </div>
              </div>
              <button onClick={() => setEditingHighlight(null)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSingleHighlight} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Observação Técnico/Tática Individual</label>
                <textarea 
                  rows={6} required
                  placeholder="Escreve aqui a avaliação específica sobre o desempenho do atleta nesta partida..."
                  value={editingHighlight.notes} 
                  onChange={e => setEditingHighlight({ ...editingHighlight, notes: e.target.value })}
                  className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setEditingHighlight(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
                <button type="submit" disabled={savingHighlight} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2">
                  {savingHighlight ? <Loader2 size={14} className="animate-spin" /> : 'Guardar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR NOVO HIGHLIGHT DE ATLETA A UM JOGO */}
      {isAddHighlightOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Adicionar Destaque de Atleta</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isAddHighlightOpen.matchName}</p>
              </div>
              <button onClick={() => setIsAddHighlightOpen(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddHighlightSubmit} className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">Atleta da BD</label>
                  <button 
                    type="button" 
                    onClick={() => openNewPlayerModalForMatch(isAddHighlightOpen.matchName)}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <UserPlus size={12} /> + Criar Novo Atleta
                  </button>
                </div>
                <CustomSelect
                  options={players.map(p => ({ value: p.id, label: `${p.name} (${p.position} • ${p.club})` }))}
                  value={newHighlightData.playerId}
                  onChange={val => setNewHighlightData({ ...newHighlightData, playerId: val })}
                  placeholder="Selecionar Atleta..."
                  searchable={true}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Observação Individual</label>
                <textarea 
                  rows={4} required placeholder="Análise individual do atleta neste jogo..."
                  value={newHighlightData.notes} onChange={e => setNewHighlightData({ ...newHighlightData, notes: e.target.value })}
                  className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-slate-200 font-sans focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddHighlightOpen(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium">Guardar Destaque</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRÉ-JOGO */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl">
                  <Trophy size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Agendar Novo Jogo (Pré-Jogo)</h2>
                  <p className="text-xs text-slate-400">Registo inicial de partida na agenda de observação</p>
                </div>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePreGameSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Equipa da Casa</label>
                  <CustomSelect
                    options={teams.map(t => ({ value: t.id, label: t.name }))}
                    value={preGameData.homeTeamId}
                    onChange={val => setPreGameData({ ...preGameData, homeTeamId: val })}
                    placeholder="Selecionar Equipa..."
                    searchable={true}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Equipa Visitante</label>
                  <CustomSelect
                    options={teams.map(t => ({ value: t.id, label: t.name }))}
                    value={preGameData.awayTeamId}
                    onChange={val => setPreGameData({ ...preGameData, awayTeamId: val })}
                    placeholder="Selecionar Equipa..."
                    searchable={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Data do Jogo</label>
                  <input type="date" required value={preGameData.gameDate} onChange={e => setPreGameData({ ...preGameData, gameDate: e.target.value })} className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tipo de Observação</label>
                  <CustomSelect
                    options={[{ value: '🏟️ Live', label: '🏟️ Live' }, { value: '💻 Stream', label: '💻 Stream' }]}
                    value={preGameData.type}
                    onChange={val => setPreGameData({ ...preGameData, type: val })}
                    placeholder="Selecionar Tipo..."
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Scout Responsável</label>
                  <CustomSelect
                    options={scouts.map(s => ({ value: s.id, label: s.name }))}
                    value={preGameData.scoutId}
                    onChange={val => setPreGameData({ ...preGameData, scoutId: val })}
                    placeholder="Selecionar Scout..."
                    searchable={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Competição / Liga</label>
                <CustomSelect
                  options={competitions.map(c => ({ value: c.id, label: c.name }))}
                  value={preGameData.competitionId}
                  onChange={val => setPreGameData({ ...preGameData, competitionId: val })}
                  placeholder="Selecionar Competição..."
                  searchable={true}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
                <button type="submit" disabled={submittingPre} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2">
                  {submittingPre ? <Loader2 size={16} className="animate-spin" /> : 'Agendar Jogo no Airtable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINI-MODAL: CRIAR NOVO ATLETA NA BD */}
      {isNewPlayerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <UserPlus size={16} className="text-emerald-400" /> Criar Novo Atleta na BD
              </h3>
              <button onClick={() => setIsNewPlayerOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewPlayer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nome</label>
                <input 
                  type="text" required 
                  placeholder="" 
                  value={newPlayerData.name} 
                  onChange={e => setNewPlayerData({ ...newPlayerData, name: e.target.value })} 
                  className="w-full bg-[#0d131f] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Clube Atual</label>
                <CustomSelect
                  options={(availableMatchTeams.length > 0 ? availableMatchTeams : teams).map(t => ({ value: t.id, label: t.name }))}
                  value={newPlayerData.clubId}
                  onChange={val => setNewPlayerData({ ...newPlayerData, clubId: val })}
                  placeholder="Selecionar Clube..."
                  searchable={true}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Posição Principal</label>
                <CustomSelect
                  options={POSITIONS_OPTIONS.map(pos => ({ value: pos, label: pos }))}
                  value={newPlayerData.position}
                  onChange={val => setNewPlayerData({ ...newPlayerData, position: val })}
                  placeholder="Selecionar Posição..."
                  searchable={true}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsNewPlayerOpen(false)} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancelar</button>
                <button type="submit" disabled={creatingPlayer} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-1.5">
                  {creatingPlayer ? <Loader2 size={14} className="animate-spin" /> : 'Guardar Atleta na BD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERFIL JOGADOR */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-20 bg-[#151c2c]/95 backdrop-blur border-b border-slate-800 p-6 pb-0">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  {selectedPlayer.photo ? (
                    <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-3xl shadow-xl">
                      {(selectedPlayer.name || 'J').charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1.5">{selectedPlayer.name}</h2>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full font-semibold">{selectedPlayer.position}</span>
                      <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-slate-200 font-medium">
                        {selectedPlayer.clubLogo ? (
                          <img src={selectedPlayer.clubLogo} alt={selectedPlayer.club} className="w-4 h-4 object-contain" />
                        ) : (
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{selectedPlayer.club}</span>
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                        <Activity size={12} /> {selectedPlayer.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Idade</span>
                  <span className="text-white text-base font-semibold">{selectedPlayer.age !== 'N/D' ? `${selectedPlayer.age} anos` : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Nacionalidade</span>
                  <span className="text-white text-base font-semibold flex items-center gap-1"><Flag size={12} className="text-slate-400"/> {selectedPlayer.nationality || '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Pé / Altura</span>
                  <span className="text-white text-base font-semibold">{selectedPlayer.foot || 'N/D'} • {selectedPlayer.height || 'N/D'}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Observações</span>
                  <span className="text-blue-400 text-base font-semibold">{selectedPlayer.mentions || 0} Registo(s)</span>
                </div>
              </div>

              <div className="flex gap-6 border-b border-slate-800 text-sm font-medium">
                <button onClick={() => setProfileTab('timeline')} className={`pb-3 flex items-center gap-2 border-b-2 transition ${profileTab === 'timeline' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  <FileText size={16} /> Relatórios & Timeline
                </button>
                <button onClick={() => setProfileTab('algo')} className={`pb-3 flex items-center gap-2 border-b-2 transition ${profileTab === 'algo' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  <BarChart3 size={16} /> Análise & Algoritmo
                </button>
                <button onClick={() => setProfileTab('market')} className={`pb-3 flex items-center gap-2 border-b-2 transition ${profileTab === 'market' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  <Briefcase size={16} /> Mercado & Decisão
                </button>
              </div>
            </div>

            <div className="p-6">
              {profileTab === 'timeline' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Histórico Cronológico de Observação</h3>
                  <div className="bg-[#0d131f] p-5 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {selectedPlayer.report || 'Sem observações registadas.'}
                  </div>
                </div>
              )}
              {profileTab === 'algo' && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
                  Espaço reservado para visualização dos relatórios de algoritmo.
                </div>
              )}
              {profileTab === 'market' && (
                <div className="bg-[#0d131f] p-5 rounded-xl border border-slate-800 text-sm text-slate-300">
                  Notas de Mercado & Direção Desportiva.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERFIL EQUIPA */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                {selectedTeam.logo ? (
                  <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-16 h-16 object-contain p-1.5 bg-slate-900 rounded-xl border border-slate-800" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                    <Building2 size={28} />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                  <p className="text-xs text-blue-400 font-medium mt-1">{selectedTeam.competition} • <span className="text-slate-400">{selectedTeam.country}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Jogos Vistos do Clube</span>
                <span className="text-xl font-bold text-emerald-400">{selectedTeam.totalWatchedMatches} Partidas</span>
              </div>
              <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Estatuto de Observação</span>
                <span className="text-xl font-bold text-blue-400">{selectedTeam.status}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3">Atletas de Interesse Pertencentes ao Clube</h3>
              <div className="space-y-2">
                {players.filter(p => p.club.toLowerCase() === selectedTeam.name.toLowerCase()).map(p => (
                  <div key={p.id} className="bg-[#0d131f] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm font-medium">{p.name}</span>
                      <span className="text-xs text-slate-400 ml-2">({p.position})</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedTeam(null);
                        setSelectedPlayer(p);
                        setProfileTab('timeline');
                      }}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}