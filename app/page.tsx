'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  photo?: string | null;
  position: string;
  nationality: string;
  age: string;
  club: string;
  status: string;
  report: string;
}

interface Match {
  id: string;
  matchName: string;
  type: string;
  gameDate: string;
  competition: string;
  scouts: string;
  highlightsReport: string;
}

interface Scout {
  id: string;
  name: string;
  liveMatches: number;
  streamMatches: number;
  totalMatches: number;
}

type TabType = 'jogadores' | 'matchcenter' | 'scouts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('jogadores');
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Form de Relatório
  const [showAddReport, setShowAddReport] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchAllData() {
    setLoading(true);
    setError(null);
    try {
      const [resP, resM, resS] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/matches'),
        fetch('/api/scouts'),
      ]);

      const dataP = await resP.json();
      const dataM = await resM.json();
      const dataS = await resS.json();

      if (dataP.error) throw new Error(dataP.error);

      setPlayers(dataP.players || []);
      setMatches(dataM.matches || []);
      setScouts(dataS.scouts || []);
    } catch (err: any) {
      setError(err.message || 'Erro a comunicar com o servidor Next.js');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddReport = async () => {
    if (!selectedPlayer || !reportNote) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          textNote: reportNote,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Highlight registado com SUCESSO no Airtable!');
        setReportNote('');
        setShowAddReport(false);
        // Atualiza a lista para refletir as alterações feitas no Airtable
        fetchAllData();
      } else {
        alert(`Erro ao gravar: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Falha no envio: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0b0f17',
        color: '#e2e8f0',
        fontFamily: 'Inter, sans-serif',
        padding: '20px 16px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '850px' }}>
        {/* CABEÇALHO */}
        <header
          style={{
            background: '#131c2e',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#64748b',
                fontWeight: '800',
                letterSpacing: '1px',
              }}
            >
              DEPARTAMENTO DE SCOUTING & PROSPECÇÃO
            </div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#f8fafc',
                margin: '4px 0 0 0',
              }}
            >
              LEÇA FC SAD
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: loading ? '#f59e0b' : error ? '#ef4444' : '#10b981',
              }}
            ></span>
            <span
              style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}
            >
              {loading
                ? 'Sincronizando 700+ atletas...'
                : error
                ? 'Erro de Ligação'
                : `${players.length} Atletas em Live DB`}
            </span>
          </div>
        </header>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '12px',
              marginBottom: '20px',
            }}
          >
            ⚠️ <strong>Erro:</strong> {error}. Confirma se o servidor local está
            a correr e se o <code>.env.local</code> está configurado.
          </div>
        )}

        {/* NAVEGAÇÃO */}
        <nav
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            background: '#131c2e',
            padding: '6px',
            borderRadius: '14px',
            border: '1px solid #1e293b',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => setActiveTab('jogadores')}
            style={{
              background: activeTab === 'jogadores' ? '#1e293b' : 'transparent',
              color: activeTab === 'jogadores' ? '#38bdf8' : '#94a3b8',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            👤 Base de Jogadores ({players.length})
          </button>
          <button
            onClick={() => setActiveTab('matchcenter')}
            style={{
              background:
                activeTab === 'matchcenter' ? '#1e293b' : 'transparent',
              color: activeTab === 'matchcenter' ? '#38bdf8' : '#94a3b8',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            ⚽ Match Center ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('scouts')}
            style={{
              background: activeTab === 'scouts' ? '#1e293b' : 'transparent',
              color: activeTab === 'scouts' ? '#38bdf8' : '#94a3b8',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            👥 Equipa de Scouts ({scouts.length})
          </button>
        </nav>

        {/* ABA JOGADORES */}
        {activeTab === 'jogadores' && (
          <div>
            <input
              type="text"
              placeholder="Pesquisar por nome, clube ou posição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#131c2e',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            />

            {loading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#64748b',
                }}
              >
                A descarregar os 769 atletas em direto do Airtable...
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '8px',
                }}
              >
                {filteredPlayers.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#131c2e',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      {p.photo ? (
                        <img
                          src={p.photo}
                          alt={p.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#1e293b',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                          }}
                        >
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#f8fafc',
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            marginTop: '2px',
                          }}
                        >
                          <span style={{ color: '#38bdf8' }}>{p.position}</span>{' '}
                          • {p.club}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPlayer(p)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: '#f8fafc',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA MATCH CENTER */}
        {activeTab === 'matchcenter' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {matches.map((m) => (
              <div
                key={m.id}
                style={{
                  background: '#131c2e',
                  border: '1px solid #1e293b',
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      background: '#0284c7',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '800',
                    }}
                  >
                    {m.type}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {m.gameDate} • {m.competition}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: '#f8fafc',
                    margin: '0 0 8px 0',
                  }}
                >
                  {m.matchName}
                </h3>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#38bdf8',
                    marginBottom: '12px',
                  }}
                >
                  Scouts no Terreno: {m.scouts}
                </div>
                <div
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    padding: '12px',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#64748b',
                      fontWeight: '800',
                      marginBottom: '6px',
                    }}
                  >
                    DESTAQUES DO JOGO (HIGHLIGHTS)
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#cbd5e1',
                      whiteSpace: 'pre-line',
                      lineHeight: '1.5',
                    }}
                  >
                    {m.highlightsReport}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA SCOUTS */}
        {activeTab === 'scouts' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            {scouts.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#131c2e',
                  border: '1px solid #1e293b',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#f8fafc',
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginTop: '12px',
                    background: '#1e293b',
                    padding: '10px',
                    borderRadius: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>
                      AO VIVO
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#10b981',
                      }}
                    >
                      {s.liveMatches}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>
                      STREAM
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#38bdf8',
                      }}
                    >
                      {s.streamMatches}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL FICHA DO JOGADOR */}
        {selectedPlayer && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(3, 7, 18, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 100,
            }}
          >
            <div
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '20px',
                padding: '24px',
                width: '100%',
                maxWidth: '520px',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: '#38bdf8',
                    fontWeight: '800',
                  }}
                >
                  DOSSIÊ INDIVIDUAL DE PROSPECÇÃO
                </span>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                {selectedPlayer.photo ? (
                  <img
                    src={selectedPlayer.photo}
                    alt=""
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: '#1e293b',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '20px',
                    }}
                  >
                    {selectedPlayer.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#f8fafc',
                      margin: 0,
                    }}
                  >
                    {selectedPlayer.name}
                  </h2>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#38bdf8',
                      marginTop: '2px',
                    }}
                  >
                    {selectedPlayer.position} • {selectedPlayer.club}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  padding: '14px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    color: '#38bdf8',
                    fontWeight: '800',
                    marginBottom: '8px',
                  }}
                >
                  📝 HISTÓRICO DE HIGHLIGHTS (AIRTABLE ROLLUP)
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#cbd5e1',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {selectedPlayer.report}
                </div>
              </div>

              {!showAddReport ? (
                <button
                  onClick={() => setShowAddReport(true)}
                  style={{
                    width: '100%',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#000',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  + Adicionar Highlight em Direto
                </button>
              ) : (
                <div
                  style={{
                    background: '#131c2e',
                    border: '1px solid #38bdf8',
                    padding: '14px',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#fff',
                      marginBottom: '8px',
                    }}
                  >
                    Escrever novo relatório (Grava no Airtable):
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Escreve as tuas observações sobre o jogador..."
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '10px',
                      color: '#fff',
                      fontSize: '11px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '10px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleAddReport}
                      disabled={submitting}
                      style={{
                        flex: 1,
                        background: '#38bdf8',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      {submitting ? 'A enviar...' : 'Gravar no Airtable'}
                    </button>
                    <button
                      onClick={() => setShowAddReport(false)}
                      style={{
                        background: '#1e293b',
                        color: '#aaa',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
