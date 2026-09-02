'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, 
  UserCheck, X, Activity, Ruler, FileText, BarChart3, Briefcase, Flag, Building2,
  Zap, Crosshair, BrainCircuit, ExternalLink, Globe, ChevronRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'matches' | 'scouts'>('players');
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Posição de Paginação e Pesquisa
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  
  const [teamFilterStatus, setTeamFilterStatus] = useState('All');
  const [teamFilterComp, setTeamFilterComp] = useState('All');
  
  // Controlos de Expansão Inline & Modais
  const [expandedPlayerInline, setExpandedPlayerInline] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [profileTab, setProfileTab] = useState<'timeline' | 'algo' | 'market'>('timeline');

  useEffect(() => {
    async function loadData() {
      try {
        const [resP, resT, resM, resS] = await Promise.all([
          fetch('/api/players').catch(() => ({ json: () => ({ players: [] }) })),
          fetch('/api/teams').catch(() => ({ json: () => ({ teams: [] }) })),
          fetch('/api/matches').catch(() => ({ json: () => ({ matches: [] }) })),
          fetch('/api/scouts').catch(() => ({ json: () => ({ scouts: [] }) }))
        ]);
        
        const dataP = await resP.json();
        const dataT = await resT.json();
        const dataM = await resM.json();
        const dataS = await resS.json();

        if (dataP.players) setPlayers(dataP.players);
        if (dataT.teams) setTeams(dataT.teams);
        if (dataM.matches) setMatches(dataM.matches);
        if (dataS.scouts) setScouts(dataS.scouts);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleMatch = (id: string) => setExpandedMatchId(expandedMatchId === id ? null : id);
  const togglePlayerInline = (id: string) => setExpandedPlayerInline(expandedPlayerInline === id ? null : id);

  const filteredPlayers = players.filter(p => {
    const query = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(query) || 
           (p.club || '').toLowerCase().includes(query) || 
           (p.position || '').toLowerCase().includes(query);
  });
  
  // Se houver pesquisa ativa, mostra os resultados sem corte
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
    <main className="min-h-screen bg-[#0d131f] text-slate-100 p-6 font-sans">
      
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

      {/* Tabs Principais */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-3">
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}>
          <Users size={16} /> Base de Jogadores ({players.length})
        </button>
        <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}>
          <Building2 size={16} /> Equipas ({teams.length})
        </button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}>
          <Trophy size={16} /> Matches ({matches.length})
        </button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}>
          <Shield size={16} /> Equipa de Scouts ({scouts.length})
        </button>
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
              {displayedPlayers.map((player) => {
                const isInlineExpanded = expandedPlayerInline === player.id;

                return (
                  <div key={player.id} className="bg-[#151c2c] border border-slate-800/80 rounded-xl overflow-hidden transition hover:border-slate-700">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => togglePlayerInline(player.id)}>
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

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => togglePlayerInline(player.id)}
                          className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 text-xs rounded-lg transition"
                        >
                          {isInlineExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        <button 
                          onClick={() => { setSelectedPlayer(player); setProfileTab('timeline'); }} 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                        >
                          Ver Perfil Completo
                        </button>
                      </div>
                    </div>

                    {/* GAVETA INLINE RÁPIDA */}
                    {isInlineExpanded && (
                      <div className="p-4 bg-[#111723] border-t border-slate-800/80 text-xs space-y-3">
                        <div className="grid grid-cols-4 gap-3 bg-[#0d131f] p-3 rounded-lg border border-slate-800">
                          <div><span className="text-slate-500 block">Idade</span><span className="text-slate-200 font-semibold">{player.age !== 'N/D' ? `${player.age} anos` : '--'}</span></div>
                          <div><span className="text-slate-500 block">Nacionalidade</span><span className="text-slate-200 font-semibold">{player.nationality}</span></div>
                          <div><span className="text-slate-500 block">Pé Preferencial</span><span className="text-slate-200 font-semibold">{player.foot}</span></div>
                          <div><span className="text-slate-500 block">Altura</span><span className="text-slate-200 font-semibold">{player.height}</span></div>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block mb-1">Resumo de Observação:</span>
                          <p className="text-slate-300 leading-relaxed bg-[#0d131f] p-3 rounded-lg border border-slate-800">{player.report}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BOTÃO CARREGAR MAIS */}
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
                <select value={teamFilterComp} onChange={(e) => setTeamFilterComp(e.target.value)} className="bg-[#151c2c] border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                  <option value="All">Todas as Competições</option>
                  {uniqueTeamComps.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={teamFilterStatus} onChange={(e) => setTeamFilterStatus(e.target.value)} className="bg-[#151c2c] border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                  <option value="All">Todos os Estatutos</option>
                  {uniqueTeamStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
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
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                <Plus size={16} /> Registar Jogo
              </button>
            </div>

            <div className="grid gap-3">
              {matches.map((match) => {
                const isExpanded = expandedMatchId === match.id;
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
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 bg-[#0d131f] p-4 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2"><UserCheck size={16} className="text-blue-400" /> <span><strong>Scout Observador:</strong> {match.scout}</span></div>
                          <div className="flex items-center gap-2"><Users size={16} className="text-emerald-400" /> <span><strong>Atletas Referenciados:</strong> {match.playersCount} Atleta(s)</span></div>
                        </div>

                        {match.highlightedPlayers && match.highlightedPlayers.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Atletas Referenciados Neste Jogo</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {match.highlightedPlayers.map((p: any, idx: number) => (
                                <div 
                                  key={p.id || idx}
                                  onClick={() => {
                                    const fullP = players.find(player => player.name.toLowerCase() === p.name.toLowerCase()) || p;
                                    setSelectedPlayer(fullP);
                                    setProfileTab('timeline');
                                  }}
                                  className="bg-[#151c2c] border border-slate-800/80 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/60 transition group"
                                >
                                  <div className="flex items-center gap-3">
                                    {p.photo ? (
                                      <img src={p.photo} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                                    ) : (
                                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                                        {p.name.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <h5 className="font-semibold text-white text-xs group-hover:text-blue-400 transition">{p.name}</h5>
                                      <p className="text-[11px] text-slate-400 mt-0.5">
                                        <span className="text-blue-400 font-medium">{p.position}</span> • {p.club}
                                      </p>
                                    </div>
                                  </div>
                                  <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400 transition" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Relatório & Destaques da Partida</h4>
                          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d131f] p-4 rounded-lg border border-slate-800">
                            {match.highlightsReport}
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