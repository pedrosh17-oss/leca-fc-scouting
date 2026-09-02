'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Shield, Search, Plus, ChevronDown, ChevronUp, Calendar, UserCheck } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'players' | 'matches' | 'scouts'>('players');
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

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

  const toggleMatch = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  const filteredPlayers = players.filter(p => {
    const name = p.fields['Nome do Jogador'] || '';
    const club = p.fields['Clube'] || '';
    const pos = p.fields['Posição Principal'] || '';
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
        <button
          onClick={() => setActiveTab('players')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'players' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'
          }`}
        >
          <Users size={16} /> Base de Jogadores ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'matches' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'
          }`}
        >
          <Trophy size={16} /> Matches ({matches.length})
        </button>
        <button
          onClick={() => setActiveTab('scouts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'scouts' ? 'bg-blue-600 text-white' : 'bg-[#151c2c] text-slate-400 hover:text-white'
          }`}
        >
          <Shield size={16} /> Equipa de Scouts ({scouts.length})
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* TAB PLAYERS */}
        {activeTab === 'players' && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Pesquisar por nome, clube ou posição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151c2c] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-3">
              {filteredPlayers.map((player) => {
                const name = player.fields['Nome do Jogador'] || 'Sem Nome';
                const pos = player.fields['Posição Principal'] || 'N/D';
                const clubRaw = player.fields['Clube'];
                const club = Array.isArray(clubRaw) ? 'Clube Associado' : (clubRaw && !clubRaw.startsWith('rec') ? clubRaw : 'Sem Clube');

                return (
                  <div key={player.id} className="bg-[#151c2c] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base">{name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          <span className="text-blue-400 font-medium">{pos}</span> • {club}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-700">
                      Ver Perfil
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB MATCHES */}
        {activeTab === 'matches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-400">Histórico e relatórios de partidas observadas.</p>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                <Plus size={16} /> Novo Jogo
              </button>
            </div>

            <div className="grid gap-4">
              {matches.map((match) => {
                const title = match.fields['Jogo'] || 'Jogo sem Título';
                const date = match.fields['Data'] || '';
                const notes = match.fields['Highlights'] || match.fields['Notas'] || 'Sem observações registadas.';
                const isExpanded = expandedMatchId === match.id;

                return (
                  <div key={match.id} className="bg-[#151c2c] border border-slate-800 rounded-xl overflow-hidden transition">
                    <div 
                      onClick={() => toggleMatch(match.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            {date && <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Conteúdo expandido */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800 bg-[#111723]">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Destaques / Relatório do Jogo</h4>
                        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d131f] p-4 rounded-lg border border-slate-800">
                          {notes}
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
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{scout.fields['Nome'] || 'Scout'}</h3>
                  <p className="text-xs text-slate-400">{scout.fields['Email'] || 'Sem email'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}