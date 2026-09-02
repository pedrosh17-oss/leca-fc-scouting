'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, 
  UserCheck, X, Activity, Ruler, FileText, BarChart3, Briefcase, TrendingUp, Flag, ShieldAlert
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'scouts'>('players');
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  
  // Abas internas do Perfil do Jogador
  const [profileTab, setProfileTab] = useState<'timeline' | 'algo' | 'market'>('timeline');

  useEffect(() => {
    async function loadData() {
      try {
        const [resP, resM, resS] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/matches'),
          fetch('/api/scouts')
        ]);
        
        const dataP = await resP.json();
        const dataM = await resM.json();
        const dataS = await resS.json();

        if (dataP.players) setPlayers(dataP.players);
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

  const filteredPlayers = players.filter(p => {
    const name = p.name || '';
    const club = p.club || '';
    const pos = p.position || '';
    const query = search.toLowerCase();
    return name.toLowerCase().includes(query) || club.toLowerCase().includes(query) || pos.toLowerCase().includes(query);
  });

  return (
    <main className="min-h-screen bg-[#0d131f] text-slate-100 p-6 font-sans">
      
      {/* Header da App */}
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
      <div className="max-w-6xl mx-auto mb-6 flex gap-3">
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Users size={16} /> Base de Jogadores ({players.length})</button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Trophy size={16} /> Matches ({matches.length})</button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'}`}><Shield size={16} /> Equipa de Scouts ({scouts.length})</button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* TAB PLAYERS */}
        {activeTab === 'players' && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input type="text" placeholder="Pesquisar por nome, clube ou posição..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid gap-3">
              {filteredPlayers.map((player) => (
                <div key={player.id} className="bg-[#151c2c] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                  <div className="flex items-center gap-4">
                    {player.photo ? (
                        <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                          {player.name.charAt(0)}
                        </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white text-base">{player.name}</h3>
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
                    onClick={() => {
                      setSelectedPlayer(player);
                      setProfileTab('timeline');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-700"
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB MATCHES EXPANDIDA */}
        {activeTab === 'matches' && (
          <div className="grid gap-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-400">Jogos observados e volume de atletas identificados.</p>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                <Plus size={16} /> Registar Jogo
              </button>
            </div>

            <div className="grid gap-3">
              {matches.map((match) => {
                const isExpanded = expandedMatchId === match.id;

                return (
                  <div key={match.id} className="bg-[#151c2c] border border-slate-800 rounded-xl overflow-hidden transition hover:border-slate-700">
                    <div 
                      onClick={() => toggleMatch(match.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Trophy size={22} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-base">{match.matchName}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-slate-300"><Calendar size={12} /> {match.gameDate}</span>
                            <span>•</span>
                            <span className="text-blue-400 font-medium">{match.competition}</span>
                            <span>•</span>
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{match.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <span className="block text-xs font-semibold text-emerald-400">{match.playersCount} Jogadores</span>
                          <span className="text-[10px] text-slate-500 uppercase">Destacados</span>
                        </div>
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800 bg-[#111723] space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 bg-[#0d131f] p-3 rounded-lg border border-slate-800">
                          <span><strong>Scout Observador:</strong> {match.scout}</span>
                          <span><strong>Atletas Referenciados:</strong> {match.playersCount}</span>
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

        {/* TAB SCOUTS */}
        {activeTab === 'scouts' && (
          <div className="grid gap-3">
             {scouts.map((scout) => (
               <div key={scout.id} className="bg-[#151c2c] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400"><UserCheck size={20} /></div>
                  <div>
                    <h3 className="font-semibold text-white">{scout.name || 'Scout'}</h3>
                    <p className="text-xs text-slate-400">Jogos: {scout.totalMatches} (Live: {scout.liveMatches} | Stream: {scout.streamMatches})</p>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* MODAL MACRO: PERFIL COMPLETO DO JOGADOR */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. Header do Modal */}
            <div className="sticky top-0 z-20 bg-[#151c2c]/95 backdrop-blur border-b border-slate-800 p-6 pb-0">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  {selectedPlayer.photo ? (
                    <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-3xl shadow-xl">
                      {selectedPlayer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1.5">{selectedPlayer.name}</h2>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full font-semibold">{selectedPlayer.position}</span>
                      
                      {/* Símbolo + Nome do Clube */}
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

                <button 
                  onClick={() => setSelectedPlayer(null)} 
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Specs Rápidas */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Idade</span>
                  <span className="text-white text-base font-semibold">{selectedPlayer.age !== 'N/D' ? `${selectedPlayer.age} anos` : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Nacionalidade</span>
                  <span className="text-white text-base font-semibold flex items-center gap-1"><Flag size={12} className="text-slate-400"/> {selectedPlayer.nationality !== 'N/A' ? selectedPlayer.nationality : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Pé / Altura</span>
                  <span className="text-white text-base font-semibold">{selectedPlayer.foot} • {selectedPlayer.height}</span>
                </div>
                <div className="bg-[#0d131f] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Observações</span>
                  <span className="text-blue-400 text-base font-semibold">{selectedPlayer.mentions} Registo(s)</span>
                </div>
              </div>

              {/* 2. Navegação por Abas Internas */}
              <div className="flex gap-6 border-b border-slate-800 text-sm font-medium">
                <button
                  onClick={() => setProfileTab('timeline')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                    profileTab === 'timeline' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText size={16} /> Relatórios & Timeline
                </button>
                <button
                  onClick={() => setProfileTab('algo')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                    profileTab === 'algo' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 size={16} /> Análise & Algoritmo
                </button>
                <button
                  onClick={() => setProfileTab('market')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                    profileTab === 'market' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase size={16} /> Mercado & Decisão
                </button>
              </div>
            </div>

            {/* 3. Conteúdo da Aba Selecionada */}
            <div className="p-6">
              
              {/* ABA 1: RELATÓRIOS & TIMELINE */}
              {profileTab === 'timeline' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Histórico Cronológico de Observação</h3>
                  {selectedPlayer.report !== 'Sem observações registadas.' ? (
                    <div className="bg-[#0d131f] p-5 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans shadow-inner">
                      {selectedPlayer.report}
                    </div>
                  ) : (
                    <div className="bg-slate-800/20 border border-slate-800/60 border-dashed p-8 rounded-xl text-center">
                      <p className="text-slate-500 text-sm">Nenhum relatório técnico registado para este atleta até ao momento.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 2: ANÁLISE & ALGORITMO (Espaço preparado) */}
              {profileTab === 'algo' && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400">Integração Looker Studio / Algoritmo</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Espaço reservado para carregamento de dados via Excel e cálculo de Ratings.</p>
                    </div>
                    <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-lg">Em Breve</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block mb-1">Rating Algorítmico</span>
                      <span className="text-2xl font-bold text-slate-400">-- / 100</span>
                    </div>
                    <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block mb-1">Perfil Tático</span>
                      <span className="text-sm font-semibold text-slate-400">Pendente de Upload</span>
                    </div>
                    <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block mb-1">Potencial Relativo</span>
                      <span className="text-sm font-semibold text-slate-400">--</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: MERCADO & DECISÃO (Direção Desportiva) */}
              {profileTab === 'market' && (
                <div className="space-y-4">
                  <div className="bg-[#0d131f] p-5 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notas da Direção Desportiva & Mercado</h4>
                    <textarea 
                      placeholder="Espaço exclusivo do Diretor Desportivo / Head Scout para registar valores de contrato, contactos de empresários e decisões de mercado..."
                      className="w-full bg-[#151c2c] border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 min-h-[100px]"
                      disabled
                    />
                    <p className="text-[11px] text-slate-500 mt-2">A edição destas notas estará ativa após a implementação do sistema de Logins (RBAC).</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </main>
  );
}