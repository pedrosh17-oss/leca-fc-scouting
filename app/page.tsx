'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, UserCheck, X, Activity, Ruler, FileText, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'scouts'>('players');
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  // Novo Estado para o Perfil do Jogador (Guarda o jogador completo)
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

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
        console.error("Erro", err);
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
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="text-blue-400 font-medium">{player.position}</span> • {player.club}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlayer(player)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-700"
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB MATCHES */}
        {activeTab === 'matches' && (
          <div className="grid gap-4">
             {/* Conteúdo mantido igual ao anterior */}
             <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-400">Histórico e relatórios de partidas.</p>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"><Plus size={16} /> Novo Jogo</button>
            </div>
             {matches.map((match) => (
               <div key={match.id} className="bg-[#151c2c] border border-slate-800 rounded-xl overflow-hidden">
                 <div onClick={() => toggleMatch(match.id)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400"><Trophy size={20} /></div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{match.matchName || 'Jogo sem Título'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{match.gameDate} • {match.competition}</p>
                      </div>
                    </div>
                    <div className="text-slate-400">{expandedMatchId === match.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                 </div>
                 {expandedMatchId === match.id && (
                   <div className="p-5 border-t border-slate-800 bg-[#111723]">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Relatório do Jogo</h4>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d131f] p-4 rounded-lg border border-slate-800">{match.highlightsReport}</div>
                   </div>
                 )}
               </div>
             ))}
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

      {/* MODAL: PERFIL COMPLETO DO JOGADOR */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151c2c] border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header do Modal */}
            <div className="sticky top-0 z-10 flex justify-between items-start p-6 bg-[#151c2c]/90 backdrop-blur border-b border-slate-800">
              <div className="flex items-center gap-5">
                {selectedPlayer.photo ? (
                  <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-20 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-3xl shadow-lg">
                    {selectedPlayer.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedPlayer.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md font-medium">{selectedPlayer.position}</span>
                    <span className="text-slate-300">{selectedPlayer.club}</span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md font-medium">
                      <Activity size={14} /> {selectedPlayer.status}
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

            {/* Corpo do Modal */}
            <div className="p-6">
              
              {/* Grid de Informação Física e Demográfica */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800/80">
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold"><Calendar size={14} /> Idade</span>
                  <span className="text-slate-200 text-lg font-medium">{selectedPlayer.age !== 'N/D' ? selectedPlayer.age : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800/80">
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold"><Activity size={14} /> Pé Pref.</span>
                  <span className="text-slate-200 text-lg font-medium">{selectedPlayer.foot !== 'N/D' ? selectedPlayer.foot : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800/80">
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold"><Ruler size={14} /> Altura</span>
                  <span className="text-slate-200 text-lg font-medium">{selectedPlayer.height !== 'N/D' ? selectedPlayer.height : '--'}</span>
                </div>
                <div className="bg-[#0d131f] p-4 rounded-xl border border-slate-800/80">
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold"><BarChart3 size={14} /> Observações</span>
                  <span className="text-slate-200 text-lg font-medium">{selectedPlayer.mentions} Relatórios</span>
                </div>
              </div>

              {/* Secção de Relatórios / Highlights */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-3">
                  <FileText size={18} className="text-blue-400" />
                  Histórico de Observação
                </h3>
                
                {selectedPlayer.report !== 'Sem observações registadas.' ? (
                  <div className="bg-[#0d131f] p-5 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedPlayer.report}
                  </div>
                ) : (
                  <div className="bg-slate-800/20 border border-slate-800/50 border-dashed p-8 rounded-xl text-center">
                    <p className="text-slate-500 text-sm">Ainda não existem relatórios técnicos ou destaques associados a este atleta.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}