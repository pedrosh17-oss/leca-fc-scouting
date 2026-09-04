'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Trophy, Shield, Search, ArrowRight, Loader2, LogOut, CheckCircle2, 
  Menu, X, LayoutDashboard, BarChart3, Briefcase, Building2, Sliders, Sun, Moon 
} from 'lucide-react';

import * as XLSX from 'xlsx';
import localforage from 'localforage';
import { createClient } from '@supabase/supabase-js';

// Importações da Arquitetura Modular
import { Role, Player, Team, Match, Scout, MarketOpportunity, DecisionFormData, MarketFormData } from './types';
import { DEPT_PASSWORD } from './constants/options';

// UI
import CustomSelect from './components/ui/CustomSelect';

// Modais
import MarketModal from './components/modals/MarketModal';
import MarketDecisionModal from './components/modals/MarketDecisionModal';
import PlayerProfileModal from './components/modals/PlayerProfileModal';
import NewTeamModal from './components/modals/NewTeamModal';
import NewPlayerModal from './components/modals/NewPlayerModal';
import PillarDetailModal from './components/modals/PillarDetailModal';

// Tabs
import DashboardTab from './components/tabs/DashboardTab';
import MarketTab from './components/tabs/MarketTab';
import PlayersTab from './components/tabs/PlayersTab';
import TeamsTab from './components/tabs/TeamsTab';
import StatsTab from './components/tabs/StatsTab';
import MatchesTab from './components/tabs/MatchesTab';
import ScoutsTab from './components/tabs/ScoutsTab';
import AdminTab from './components/tabs/AdminTab';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zlvakhbqskmsubxmyvvr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TBhrZLVa7hAP3EPrDrAbiQ_mI2v_egy';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getRoleForUser(name: string): Role {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('pedro oliveira')) return 'ADMIN';
  if (lowerName.includes('miguel salvador')) return 'DIRECTOR';
  if (
    lowerName.includes('josé luís') || 
    lowerName.includes('jose luis') || 
    lowerName.includes('andré da silva') || 
    lowerName.includes('andre da silva')
  ) return 'EXECUTIVE';
  return 'SCOUT';
}

function getUserTitle(name: string): string {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('pedro oliveira')) return 'Head of Scouting';
  if (lowerName.includes('miguel salvador')) return 'Diretor Desportivo';
  if (lowerName.includes('josé luís') || lowerName.includes('jose luis')) return 'Presidente';
  if (lowerName.includes('andré da silva') || lowerName.includes('andre da silva')) return 'Diretor Geral';
  return 'Scout do Clube';
}

function renderFormattedMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-slate-200">
      {lines.map((line, idx) => {
        if (line.trim() === '---') return <hr key={idx} className="my-4 border-slate-700/60" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem] leading-relaxed'}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

function extractPlayerBaseName(str: string): string {
  if (!str) return '';
  return str.replace(/\s*\([^)]*\)/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function extractContextTag(row: any): string {
  const idStr = row.Player_ID || row.Player || '';
  const match = idStr.match(/\(([^)]+)\)/);
  if (match) {
    const content = match[1];
    if (content.includes('-')) {
      const parts = content.split('-');
      return parts[parts.length - 1].trim(); 
    }
    return content.trim();
  }
  if (row.Competição && row.Competição !== 'N/D') return row.Competição;
  return 'Atual';
}

function getPlayerAlgoEntries(player: any, algorithmData: Record<string, any[]>) {
  if (!player || !algorithmData) return [];
  const cleanName = extractPlayerBaseName(player.name);
  const currentClub = extractPlayerBaseName(player.club || '');
  const playerAge = Number(player.age);
  
  const rawPlayerH = Number(String(player.height || '').replace(/[^0-9.]/g, ''));
  const playerHeight = rawPlayerH > 0 ? (rawPlayerH < 3 ? rawPlayerH * 100 : rawPlayerH) : 0;

  const targetNameWords = cleanName.split(/\s+/).filter(Boolean);
  const targetLastName = targetNameWords[targetNameWords.length - 1] || '';
  const targetFirstInitial = targetNameWords[0]?.[0] || '';
  const targetClubWords = currentClub.split(/\s+/).filter(w => w.length > 2);

  const checkNameMatch = (rName: string) => {
    if (rName === cleanName) return true;
    const rNameWords = rName.split(/\s+/).filter(Boolean);
    const rLastName = rNameWords[rNameWords.length - 1] || '';
    const rFirstWord = rNameWords[0] || '';
    
    if (rNameWords.length > 0 && targetNameWords.length > 0) {
      const isSubset = rNameWords.every(w => targetNameWords.includes(w)) || targetNameWords.every(w => rNameWords.includes(w));
      if (isSubset) return true;
    }

    const isInitial = rFirstWord.length === 1 || (rFirstWord.length === 2 && rFirstWord.endsWith('.'));
    if (isInitial) {
      const rFirstInitial = rFirstWord[0];
      if (rLastName === targetLastName && rFirstInitial === targetFirstInitial && targetLastName.length > 2) return true;
    }
    return false;
  };

  const checkClubMatch = (rClub: string) => {
    if (!currentClub || !rClub) return false;
    if (currentClub.includes(rClub) || rClub.includes(currentClub)) return true;
    const rClubWords = rClub.split(/\s+/).filter(w => w.length > 2);
    return targetClubWords.some(w => rClubWords.includes(w));
  };

  let anchorRow: any = null;
  for (const entries of Object.values(algorithmData)) {
    if (!entries) continue;
    for (const e of entries) {
      const rowName = extractPlayerBaseName(e.row?.Player || e.row?.Player_ID || '');
      const rowClub = extractPlayerBaseName(e.row?.Team_Calc || e.row?.Team || '');
      if (checkNameMatch(rowName) && checkClubMatch(rowClub)) {
        anchorRow = e.row;
        break;
      }
    }
    if (anchorRow) break;
  }

  const anchorAge = anchorRow && !isNaN(Number(anchorRow.Age)) ? Number(anchorRow.Age) : playerAge;
  const rawAnchorH = Number(anchorRow?.Height);
  const anchorHeight = !isNaN(rawAnchorH) && rawAnchorH > 0 ? (rawAnchorH < 3 ? rawAnchorH * 100 : rawAnchorH) : playerHeight;

  const matchedEntries: any[] = [];
  for (const entries of Object.values(algorithmData)) {
    if (!entries) continue;
    for (const e of entries) {
      const rowName = extractPlayerBaseName(e.row?.Player || e.row?.Player_ID || '');
      const rowClub = extractPlayerBaseName(e.row?.Team_Calc || e.row?.Team || '');
      const rowAge = Number(e.row?.Age);
      const rawH = Number(e.row?.Height);
      const rowHeight = !isNaN(rawH) && rawH > 0 ? (rawH < 3 ? rawH * 100 : rawH) : 0;

      if (!checkNameMatch(rowName)) continue;
      const isClubMatch = checkClubMatch(rowClub);

      if (!isClubMatch) {
        if (!isNaN(anchorAge) && !isNaN(rowAge) && Math.abs(anchorAge - rowAge) > 1) continue;
        if (anchorHeight > 0 && rowHeight > 0 && Math.abs(anchorHeight - rowHeight) > 2) continue;
      } else {
        if (!isNaN(anchorAge) && !isNaN(rowAge) && Math.abs(anchorAge - rowAge) > 2) continue;
      }

      matchedEntries.push({ ...e, isClubMatch });
    }
  }

  const groupedByTag: Record<string, any[]> = {};
  for (const item of matchedEntries) {
    const tag = item.tag || 'Geral';
    if (!groupedByTag[tag]) groupedByTag[tag] = [];
    groupedByTag[tag].push(item);
  }

  const finalRows: any[] = [];
  for (const tagRows of Object.values(groupedByTag)) {
    if (tagRows.length === 1) {
      finalRows.push(tagRows[0]);
    } else {
      const clubMatch = tagRows.find(r => r.isClubMatch);
      if (clubMatch) {
        finalRows.push(clubMatch);
      } else {
        const closest = tagRows.sort((a, b) => {
           const diffA = isNaN(Number(a.row?.Age)) ? 99 : Math.abs(anchorAge - Number(a.row?.Age));
           const diffB = isNaN(Number(b.row?.Age)) ? 99 : Math.abs(anchorAge - Number(b.row?.Age));
           return diffA - diffB;
        })[0];
        finalRows.push(closest);
      }
    }
  }

  return finalRows.sort((a, b) => b.tag.localeCompare(a.tag));
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScoutId, setAuthScoutId] = useState<string | null>(null);
  const [authScoutName, setAuthScoutName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>('SCOUT');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'players' | 'teams' | 'matches' | 'scouts' | 'admin' | 'stats' | 'market'>('dashboard');
  const [comparePlayerKeyA, setComparePlayerKeyA] = useState<string>('');
  const [comparePlayerKeyB, setComparePlayerKeyB] = useState<string>('');
  const [comparePlayerKeyC, setComparePlayerKeyC] = useState<string>('');

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  // Filtros
  const [playerPositionFilter, setPlayerPositionFilter] = useState('All');
  const [playerStatusFilter, setPlayerStatusFilter] = useState('All');
  const [minAgeFilter, setMinAgeFilter] = useState<number>(15);
  const [maxAgeFilter, setMaxAgeFilter] = useState<number>(40);
  const [birthYearFilter, setBirthYearFilter] = useState<string>('All');
  const [teamFilterStatus, setTeamFilterStatus] = useState('All');
  const [teamFilterComp, setTeamFilterComp] = useState('All');

  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [editingMatchId, setExpandedMatchEdit] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedScout, setSelectedScout] = useState<Scout | null>(null);
  const [profileTab, setProfileTab] = useState<'timeline' | 'algo' | 'market' | 'reports'>('timeline');

  const [selectedPillarDetail, setSelectedPillarDetail] = useState<string | null>(null);
  const [algorithmData, setAlgorithmData] = useState<Record<string, { tag: string; row: any }[]>>({});
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Mercados
  const [scoutMarketAssignments, setScoutMarketAssignments] = useState<Record<string, string[]>>({});
  const [adminMarkets, setAdminMarkets] = useState<string[]>([]);
  const [newMarketInput, setNewMarketInput] = useState('');

  // Modais Forms
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submittingPre, setSubmittingPre] = useState(false);
  const [preGameData, setPreGameData] = useState({ homeTeamId: '', awayTeamId: '', gameDate: new Date().toISOString().split('T')[0], competitionId: '', scoutIds: [] as string[], type: '' });

  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportData, setReportData] = useState({ homeTactic: '', awayTactic: '', tempo: '', intensity: '', technical: '', pressure: '', notes: '', scoutIds: [] as string[] });

  const [editingHighlight, setEditingHighlight] = useState<{ matchId: string; matchName: string; player: any; highlightId: string | null; notes: string; } | null>(null);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<{ matchId: string; matchName: string } | null>(null);
  const [newHighlightData, setNewHighlightData] = useState({ playerId: '', notes: '' });

  const [isNewPlayerOpen, setIsNewPlayerOpen] = useState(false);
  const [newPlayerData, setNewPlayerData] = useState({ name: '', clubId: '', position: '' });
  const [creatingPlayer, setCreatingPlayer] = useState(false);
  const [availableMatchTeams, setAvailableMatchTeams] = useState<Array<{ id: string; name: string; logo?: string | null }>>([]);

  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [newTeamData, setNewTeamData] = useState({ name: '', competitionId: '' });
  const [creatingTeam, setCreatingTeam] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lecaLogoUrl = "/logo.png";

  const [marketOpportunities, setMarketOpportunities] = useState<MarketOpportunity[]>([]);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [submittingMarket, setSubmittingMarket] = useState(false);
  const initialMarketForm: MarketFormData = {
    playerId: '', name: '', club: '', position: '', foot: '', birthDate: '',
    offerDate: new Date().toISOString().split('T')[0],
    marketTarget: '', scout: '', viability: '', confLiga3: '', confLiga2: '',
    contract: '', utilization: '', strengths: '', weaknesses: '', reason: '',
    similarity: '', mental: ''
  };

  const [marketFormData, setMarketFormData] = useState<MarketFormData>(initialMarketForm);
  const [selectedMarketOppToEdit, setSelectedMarketOppToEdit] = useState<any>(null);
  const [decisionFormData, setDecisionFormData] = useState<DecisionFormData>({
    status: 'Em Avaliação',
    vetoReason: '',
    vetoDate: new Date().toISOString().split('T')[0],
    presidentOpinion: '',
    notesDD: ''
  });
  const [updatingDecision, setUpdatingDecision] = useState(false);

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

        const cleanBase = extractPlayerBaseName(cleanPlayerName);
        const words = cleanBase.split(/\s+/).filter(Boolean);
        const firstName = words[0] || '';
        const lastName = words[words.length - 1] || '';

        let displayName = cleanPlayerName;
        const isInitial = firstName.length === 1 || (firstName.length === 2 && firstName.endsWith('.'));

        if (isInitial && lastName.length > 2) {
          const dbMatch = players.find(p => {
            const pClean = extractPlayerBaseName(p.name);
            const pWords = pClean.split(/\s+/).filter(Boolean);
            const pFirst = pWords[0] || '';
            const pLast = pWords[pWords.length - 1] || '';
            return pLast === lastName && pFirst.startsWith(firstName[0]);
          });

          if (dbMatch) displayName = `${cleanPlayerName} (${dbMatch.name})`;
        }

        let label = displayName;
        if (teamName && seasonTag) label += ` (${teamName} - ${seasonTag})`;
        else if (teamName) label += ` (${teamName})`;
        else if (seasonTag) label += ` (${seasonTag})`;

        const optionValue = `${key}___${seasonIdx}`;
        const dedupKey = `${extractPlayerBaseName(cleanPlayerName)}_${extractPlayerBaseName(teamName)}_${seasonTag}`.toLowerCase();

        if (!optionsMap.has(dedupKey)) {
          optionsMap.set(dedupKey, { value: optionValue, label, row });
        }
      });
    });

    return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [algorithmData, players]);

  const resetMarketModal = () => {
    setMarketFormData(initialMarketForm);
    setIsMarketModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const [resP, resT, resM, resS, resMkt] = await Promise.all([
        fetch('/api/players').catch(() => ({ json: () => ({ players: [] }) })),
        fetch('/api/teams').catch(() => ({ json: () => ({ teams: [] }) })),
        fetch('/api/matches').catch(() => ({ json: () => ({ matches: [], competitions: [] }) })),
        fetch('/api/scouts').catch(() => ({ json: () => ({ scouts: [] }) })),
        fetch('/api/market').catch(() => ({ json: () => ({ opportunities: [] }) })),
      ]);
      
      const dataP = await resP.json(); 
      const dataT = await resT.json(); 
      const dataM = await resM.json(); 
      const dataS = await resS.json();
      const dataMkt = await resMkt.json();
      
      if (dataP.players) setPlayers(dataP.players);
      if (dataT.teams) setTeams(dataT.teams);
      if (dataM.matches) setMatches(dataM.matches);
      if (dataM.competitions) setCompetitions(dataM.competitions);
      if (dataMkt.opportunities) setMarketOpportunities(dataMkt.opportunities);

      try {
        const { data } = supabase.storage.from('Scouting').getPublicUrl('algo-data.json.gz');
        if (data?.publicUrl) {
          const resAlgo = await fetch(`${data.publicUrl}?t=${Date.now()}`);
          if (resAlgo.ok && resAlgo.body) {
            const decompressedStream = resAlgo.body.pipeThrough(new DecompressionStream('gzip'));
            const decompressedText = await new Response(decompressedStream).text();
            const remoteAlgoData = JSON.parse(decompressedText);
            setAlgorithmData(remoteAlgoData);
            await localforage.setItem('leca_algo_data', remoteAlgoData);
          }
        }
      } catch (err) {
        localforage.getItem('leca_algo_data').then((savedAlgo) => {
          if (savedAlgo) setAlgorithmData(savedAlgo as Record<string, any>);
        });
      }

      if (dataS.scouts) {
        setScouts(dataS.scouts);
        const savedAuthId = localStorage.getItem('leca_scout_auth');
        if (savedAuthId) {
          const user = dataS.scouts.find((s: any) => s.id === savedAuthId);
          if (user) {
            setIsAuthenticated(true);
            setAuthScoutId(user.id);
            setAuthScoutName(user.name);
            setUserRole(getRoleForUser(user.name));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    const savedAssignments = localStorage.getItem('leca_scout_markets');
    if (savedAssignments) {
      try { setScoutMarketAssignments(JSON.parse(savedAssignments)); } catch (e) {}
    }
  }, []);

  const handleUpdateDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarketOppToEdit) return;
    setUpdatingDecision(true);
    try {
      const res = await fetch('/api/market', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: selectedMarketOppToEdit.id, ...decisionFormData }),
      });
      if (res.ok) {
        setSelectedMarketOppToEdit(null);
        await loadData();
        showToast("Decisão atualizada no Airtable!");
      } else {
        showToast("Erro ao atualizar decisão.");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro de ligação.");
    } finally {
      setUpdatingDecision(false);
    }
  };

  const handleSelectExistingPlayerForMarket = (selectedId: string) => {
    const p = players.find(item => item.id === selectedId);
    if (p) {
      setMarketFormData(prev => ({
        ...prev,
        playerId: p.id,
        name: p.name,
        club: p.club || '',
        position: p.position || '',
        foot: p.foot || '',
        birthDate: p.birthDate || p.birth_date || ''
      }));
    }
  };

  const handleMarketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingMarket(true);
    try {
      const payload = { ...marketFormData, scout: marketFormData.scout || authScoutName };
      const res = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsMarketModalOpen(false);
        setMarketFormData(initialMarketForm);
        await loadData();
        showToast("Oportunidade registada com sucesso!");
      } else {
        const errorData = await res.json();
        showToast(`Erro Airtable: ${errorData.error?.error?.message || "Erro desconhecido"}`);
      }
    } catch (err) {
      console.error(err);
      showToast("Erro de ligação.");
    } finally {
      setSubmittingMarket(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExcel(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        const newAlgoData: Record<string, { tag: string; row: any }[]> = {};
        rawData.forEach((row) => {
          const rawPlayerStr = row.Player || row.Player_ID || '';
          const teamStr = row.Team_Calc || row.Team || row.Equipa || '';
          const cleanName = extractPlayerBaseName(rawPlayerStr);
          const cleanTeam = extractPlayerBaseName(teamStr);
          const baseTag = extractContextTag(row);
          const tag = teamStr ? `${baseTag} (${teamStr})` : baseTag;

          if (cleanName) {
            const cleanRow: Record<string, any> = {};
            Object.keys(row).forEach((k) => {
              if (row[k] !== null && row[k] !== undefined && row[k] !== '') cleanRow[k] = row[k];
            });

            const topAttrsArr = [];
            for (let i = 1; i <= 5; i++) {
              if (row[`Top_Attr_${i}_Name`]) topAttrsArr.push(row[`Top_Attr_${i}_Name`]);
            }
            if (topAttrsArr.length > 0) cleanRow['Top_5_Atributos'] = topAttrsArr.join(', ');

            const isGK = (row.Position || row.Setor_Avaliacao || '').toLowerCase().includes('gk');
            const posSuffix = isGK ? '_gk' : '_field';

            const uniqueKeyWithTeam = `${cleanName}_${cleanTeam}${posSuffix}`;
            if (!newAlgoData[uniqueKeyWithTeam]) newAlgoData[uniqueKeyWithTeam] = [];
            newAlgoData[uniqueKeyWithTeam].push({ tag, row: cleanRow });

            const genericKey = `${cleanName}${posSuffix}`;
            if (!newAlgoData[genericKey]) newAlgoData[genericKey] = [];
            newAlgoData[genericKey].push({ tag, row: cleanRow });
          }
        });

        setAlgorithmData(newAlgoData);
        await localforage.setItem('leca_algo_data', newAlgoData);

        const jsonString = JSON.stringify(newAlgoData);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });
        const compressedStream = jsonBlob.stream().pipeThrough(new CompressionStream('gzip'));
        const compressedBlob = await new Response(compressedStream).blob();

        const { error } = await supabase.storage.from('Scouting').upload('algo-data.json.gz', compressedBlob, { contentType: 'application/gzip', upsert: true });
        if (error) throw error;

        showToast("Ficheiro processado com sucesso!");
      } catch (error: any) {
        console.error("Erro no upload:", error);
        showToast("Erro ao sincronizar dados.");
      } finally {
        setUploadingExcel(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCreateNewTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTeam(true);
    try {
      const res = await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTeamData) });
      if (res.ok) {
        await loadData();
        setIsNewTeamOpen(false);
        setNewTeamData({ name: '', competitionId: '' });
        showToast(`Equipa "${newTeamData.name}" criada com sucesso!`);
      }
    } catch (err) { console.error(err); } finally { setCreatingTeam(false); }
  };

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
    } else {
      setAuthError('Password incorreta ou Perfil não selecionado.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthScoutId(null);
    setAuthScoutName(null);
    setUserRole('SCOUT');
    setAuthPassword('');
    setActiveTab('dashboard');
    localStorage.removeItem('leca_scout_auth');
  };

  const canCreateMatches = userRole === 'ADMIN' || userRole === 'SCOUT';
  const canEditMatches = userRole === 'ADMIN' || userRole === 'SCOUT';
  const canSeeMarket = true;
  const isAdmin = userRole === 'ADMIN';

  const displayScouts = scouts.filter(s => {
    const role = getRoleForUser(s.name);
    return role === 'SCOUT' || role === 'ADMIN';
  });

  const navigateToMatch = (matchId: string) => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
    setSelectedScout(null);
    setActiveTab('matches');
    setExpandedMatchId(matchId);
    setTimeout(() => {
      const element = document.getElementById(`match-${matchId}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

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

  const getScoutMatches = (scoutName: string) => matches.filter(m => (m.scout || '').toLowerCase().includes((scoutName || '').toLowerCase()));

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

  const uniqueAlgoPlayersCount = Object.keys(algorithmData).filter(k => !k.endsWith('_gk') && !k.endsWith('_field')).length;

  const themeBg = isDarkMode ? 'bg-[#0d131f] text-slate-100' : 'bg-slate-100 text-slate-800';
  const themeCard = isDarkMode ? 'bg-[#151c2c] border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const themeHeader = isDarkMode ? 'bg-[#151c2c]/95 border-slate-800' : 'bg-white/95 border-slate-200';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  if (loading) {
    return (
      <div className={`min-h-screen ${themeBg} flex flex-col items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-400" />
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400">A carregar LEÇA FC...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${themeBg} flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden`}>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className={`w-full max-w-md ${themeCard} backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 z-10 border`}>
          <div className="w-24 h-24 bg-slate-900 rounded-2xl border border-slate-700/60 flex items-center justify-center p-2 mb-6 shadow-xl relative overflow-hidden group">
            <img src={lecaLogoUrl} alt="Leça FC" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wide mb-1 text-center">LEÇA FC</h1>
          <p className={`text-xs md:text-sm ${themeTextMuted} mb-8 text-center font-medium`}>Departamento de Scouting e Prospeção</p>
          <form onSubmit={handleLogin} className="w-full space-y-5">
             <div>
                <label className={`block text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-widest mb-2`}>Quem és tu?</label>
                <CustomSelect options={scouts.map(s => ({ value: s.id, label: s.name, image: s.photo }))} value={authScoutId || ''} onChange={val => setAuthScoutId(val)} placeholder="Seleciona o teu perfil..." searchable={true} isDarkMode={isDarkMode} />
             </div>
             <div>
                <label className={`block text-[10px] md:text-xs font-bold ${themeTextMuted} uppercase tracking-widest mb-2`}>Password do Departamento</label>
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

  // Lógica de Filtros de Jogadores
  const uniquePlayerStatuses = Array.from(new Set(players.map(p => p.status).filter((s): s is string => Boolean(s)))).sort();
  const cleanPositionOptions = [{ value: 'All', label: 'Todas as Posições' }, ...Array.from(new Set(players.map(p => p.position).filter((p): p is string => Boolean(p)))).sort().map(pos => ({ value: pos, label: pos }))];
  const uniqueBirthYears = Array.from(new Set(players.map(p => p.birthYear ? String(p.birthYear) : (p.age && p.age !== 'N/D' ? String(2026 - Number(p.age)) : null)).filter((y): y is string => Boolean(y)))).sort((a, b) => Number(b) - Number(a));

  const filteredPlayers = players.filter(p => {
    const query = search.toLowerCase();
    const matchSearch = (p.name || '').toLowerCase().includes(query) || (p.club || '').toLowerCase().includes(query);
    const matchPos = playerPositionFilter === 'All' || (p.position || '').toLowerCase().includes(playerPositionFilter.toLowerCase());
    const matchStatus = playerStatusFilter === 'All' || p.status === playerStatusFilter;
    const ageNum = Number(p.age);
    const matchAge = isNaN(ageNum) || (ageNum >= minAgeFilter && ageNum <= maxAgeFilter);
    const playerYear = p.birthYear || (p.age && p.age !== 'N/D' ? String(2026 - Number(p.age)) : '');
    const matchYear = birthYearFilter === 'All' || playerYear === birthYearFilter;
    return matchSearch && matchPos && matchStatus && matchAge && matchYear;
  });

  const displayedPlayers = search || playerPositionFilter !== 'All' || playerStatusFilter !== 'All' ? filteredPlayers : filteredPlayers.slice(0, visibleCount);
  const uniqueTeamComps = Array.from(new Set(teams.map(t => t.competition).filter((c): c is string => Boolean(c) && c !== 'N/D'))).sort();
  const uniqueTeamStatus = Array.from(new Set(teams.map(t => t.status).filter((s): s is string => Boolean(s) && s !== 'N/D'))).sort();
  const filteredTeams = teams.filter(t => (t.name || '').toLowerCase().includes(search.toLowerCase()) && (teamFilterStatus === 'All' || t.status === teamFilterStatus) && (teamFilterComp === 'All' || t.competition === teamFilterComp));

  return (
    <main className={`min-h-screen ${themeBg} font-sans relative pb-10 md:pb-6 transition-colors duration-200`}>
      {toastMessage && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 font-medium text-xs md:text-sm max-w-[90vw] md:max-w-md border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 ${themeHeader} backdrop-blur-md border-b px-5 py-4 md:p-6 md:m-6 md:rounded-xl md:static flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-center p-1 shadow flex-shrink-0 group relative overflow-hidden">
            <img src={lecaLogoUrl} alt="Leça FC" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className={`hidden md:block text-[10px] md:text-xs font-semibold tracking-wider ${themeTextMuted} uppercase mb-0.5`}>Departamento de Scouting</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">LEÇA FC</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl border transition flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-200 border-slate-300 text-slate-700'}`}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {players.length} Atletas na DB
            </div>
            <div className={`flex items-center gap-2 pl-3 border-l ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium leading-tight">{authScoutName}</span>
                <span className="text-[9px] text-blue-500 font-bold uppercase">{getUserTitle(authScoutName || '')}</span>
              </div>
              <button onClick={handleLogout} className={`p-2 ml-1 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'} hover:text-red-400 rounded-lg transition`}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP TABS NAVEGAÇÃO */}
      <div className="hidden md:flex max-w-6xl mx-auto mb-6 flex-wrap gap-3 px-6 md:px-0">
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><LayoutDashboard className="w-4 h-4" /> Início</button>
        <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><BarChart3 className="w-4 h-4" /> Stats</button>
        <button onClick={() => setActiveTab('market')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'market' ? 'bg-pink-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-pink-400 hover:text-white border border-pink-500/30' : 'bg-white text-pink-600 shadow-sm'}`}><Briefcase className="w-4 h-4" /> Mercado ({marketOpportunities.length})</button>
        <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'players' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><Users className="w-4 h-4" /> Base de Jogadores ({players.length})</button>
        <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'teams' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><Building2 className="w-4 h-4" /> Equipas ({teams.length})</button>
        <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'matches' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><Trophy className="w-4 h-4" /> Match Center ({matches.length})</button>
        <button onClick={() => setActiveTab('scouts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'scouts' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-slate-400 hover:text-white' : 'bg-white text-slate-600 shadow-sm'}`}><Shield className="w-4 h-4" /> Equipa de Scouts ({displayScouts.length})</button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-lg' : isDarkMode ? 'bg-[#151c2c] text-purple-400 hover:text-white border border-purple-500/30' : 'bg-white text-purple-600 shadow-sm'}`}><Sliders className="w-4 h-4" /> Painel Admin</button>
        )}
      </div>

      {/* CONTEÚDO DAS TABS */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-4 md:mt-0">
        {activeTab === 'dashboard' && (
          <DashboardTab players={players} matches={matches} teams={teams} displayScouts={displayScouts} canCreateMatches={canCreateMatches} authScoutId={authScoutId} preGameData={preGameData} setPreGameData={setPreGameData} setIsMarketModalOpen={setIsMarketModalOpen} setIsRegisterOpen={setIsRegisterOpen} setActiveTab={setActiveTab} getRecentHighlights={getRecentHighlights} navigateToMatch={navigateToMatch} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'market' && (
          <MarketTab marketOpportunities={marketOpportunities} players={players} setIsMarketModalOpen={setIsMarketModalOpen} setSelectedMarketOppToEdit={setSelectedMarketOppToEdit} setDecisionFormData={setDecisionFormData} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'players' && (
          <PlayersTab search={search} setSearch={setSearch} playerPositionFilter={playerPositionFilter} setPlayerPositionFilter={setPlayerPositionFilter} cleanPositionOptions={cleanPositionOptions} playerStatusFilter={playerStatusFilter} setPlayerStatusFilter={setPlayerStatusFilter} uniquePlayerStatuses={uniquePlayerStatuses} birthYearFilter={birthYearFilter} setBirthYearFilter={setBirthYearFilter} uniqueBirthYears={uniqueBirthYears} minAgeFilter={minAgeFilter} setMinAgeFilter={setMinAgeFilter} maxAgeFilter={maxAgeFilter} setMaxAgeFilter={setMaxAgeFilter} displayedPlayers={displayedPlayers} filteredPlayers={filteredPlayers} visibleCount={visibleCount} setVisibleCount={setVisibleCount} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} setSelectedSeasonIdx={setSelectedSeasonIdx} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'teams' && (
          <TeamsTab search={search} setSearch={setSearch} teamFilterComp={teamFilterComp} setTeamFilterComp={setTeamFilterComp} teamFilterStatus={teamFilterStatus} setTeamFilterStatus={setTeamFilterStatus} uniqueTeamComps={uniqueTeamComps} uniqueTeamStatus={uniqueTeamStatus} filteredTeams={filteredTeams} players={players} matches={matches} setSelectedTeam={setSelectedTeam} canCreateMatches={canCreateMatches} setIsNewTeamOpen={setIsNewTeamOpen} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'stats' && (
          <StatsTab comparePlayerKeyA={comparePlayerKeyA} setComparePlayerKeyA={setComparePlayerKeyA} comparePlayerKeyB={comparePlayerKeyB} setComparePlayerKeyB={setComparePlayerKeyB} comparePlayerKeyC={comparePlayerKeyC} setComparePlayerKeyC={setComparePlayerKeyC} algoOptions={algoOptions} algorithmData={algorithmData} extractContextTag={extractContextTag} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'matches' && (
          <MatchesTab matches={matches} players={players} displayScouts={displayScouts} canCreateMatches={canCreateMatches} canEditMatches={canEditMatches} expandedMatchId={expandedMatchId} toggleMatch={id => setExpandedMatchId(expandedMatchId === id ? null : id)} editingMatchId={editingMatchId} startEditMatchContext={m => setExpandedMatchEdit(editingMatchId === m.id ? null : m.id)} setExpandedMatchEdit={setExpandedMatchEdit} reportData={reportData} setReportData={setReportData} handleReportSubmit={async id => { const res = await fetch('/api/matches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId: id, ...reportData }) }); if (res.ok) { setExpandedMatchEdit(null); await loadData(); showToast("Jogo atualizado!"); } }} submittingReport={submittingReport} setIsAddHighlightOpen={setIsAddHighlightOpen} setNewHighlightData={setNewHighlightData} setEditingHighlight={setEditingHighlight} setSelectedPlayer={setSelectedPlayer} setProfileTab={setProfileTab} setSelectedSeasonIdx={setSelectedSeasonIdx} navigateToMatch={navigateToMatch} setPreGameData={setPreGameData} preGameData={preGameData} authScoutId={authScoutId} setIsRegisterOpen={setIsRegisterOpen} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'scouts' && (
          <ScoutsTab displayScouts={displayScouts} scoutMarketAssignments={scoutMarketAssignments} setSelectedScout={setSelectedScout} getUserTitle={getUserTitle} getScoutMatches={getScoutMatches} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'admin' && isAdmin && (
          <AdminTab isAdmin={isAdmin} uniqueAlgoPlayersCount={uniqueAlgoPlayersCount} uploadingExcel={uploadingExcel} handleFileUpload={handleFileUpload} handleAddMarket={e => { e.preventDefault(); if (newMarketInput.trim()) { setAdminMarkets([...adminMarkets, newMarketInput.trim()]); setNewMarketInput(''); showToast("Mercado adicionado!"); } }} newMarketInput={newMarketInput} setNewMarketInput={setNewMarketInput} adminMarkets={adminMarkets} handleRemoveMarket={idx => { setAdminMarkets(adminMarkets.filter((_, i) => i !== idx)); showToast("Mercado removido!"); }} scouts={scouts} isDarkMode={isDarkMode} />
        )}
      </div>

      {/* MODAIS COMPONENTIZADOS */}
      <MarketModal isOpen={isMarketModalOpen} onClose={resetMarketModal} marketFormData={marketFormData} setMarketFormData={setMarketFormData} onSubmit={handleMarketSubmit} submittingMarket={submittingMarket} players={players} teams={teams} displayScouts={displayScouts} onSelectExistingPlayer={handleSelectExistingPlayerForMarket} isDarkMode={isDarkMode} />
      <MarketDecisionModal isOpen={Boolean(selectedMarketOppToEdit)} onClose={() => setSelectedMarketOppToEdit(null)} decisionFormData={decisionFormData} setDecisionFormData={setDecisionFormData} onSubmit={handleUpdateDecisionSubmit} updatingDecision={updatingDecision} isDarkMode={isDarkMode} />
      <PlayerProfileModal selectedPlayer={selectedPlayer} onClose={() => setSelectedPlayer(null)} profileTab={profileTab} setProfileTab={setProfileTab} selectedSeasonIdx={selectedSeasonIdx} setSelectedSeasonIdx={setSelectedSeasonIdx} setSelectedPillarDetail={setSelectedPillarDetail} algorithmData={algorithmData} marketOpportunities={marketOpportunities} canSeeMarket={canSeeMarket} setMarketFormData={setMarketFormData} setIsMarketModalOpen={setIsMarketModalOpen} setSelectedMarketOppToEdit={setSelectedMarketOppToEdit} setDecisionFormData={setDecisionFormData} navigateToMatch={navigateToMatch} getPlayerTimeline={getPlayerTimeline} getPlayerAlgoEntries={getPlayerAlgoEntries} extractPlayerBaseName={extractPlayerBaseName} renderFormattedMarkdown={renderFormattedMarkdown} isDarkMode={isDarkMode} />
      <NewTeamModal isOpen={isNewTeamOpen} onClose={() => setIsNewTeamOpen(false)} newTeamData={newTeamData} setNewTeamData={setNewTeamData} onSubmit={handleCreateNewTeam} creatingTeam={creatingTeam} competitions={competitions} isDarkMode={isDarkMode} />
      <NewPlayerModal isOpen={isNewPlayerOpen} onClose={() => setIsNewPlayerOpen(false)} newPlayerData={newPlayerData} setNewPlayerData={setNewPlayerData} onSubmit={async e => { e.preventDefault(); setCreatingPlayer(true); const res = await fetch('/api/players', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlayerData) }); if (res.ok) { await loadData(); setIsNewPlayerOpen(false); setNewPlayerData({ name: '', clubId: '', position: '' }); showToast("Atleta criado!"); } setCreatingPlayer(false); }} creatingPlayer={creatingPlayer} teams={teams} availableMatchTeams={availableMatchTeams} isDarkMode={isDarkMode} />
      <PillarDetailModal selectedPillarDetail={selectedPillarDetail} selectedPlayer={selectedPlayer} onClose={() => setSelectedPillarDetail(null)} selectedSeasonIdx={selectedSeasonIdx} algorithmData={algorithmData} getPlayerAlgoEntries={getPlayerAlgoEntries} isDarkMode={isDarkMode} />
    </main>
  );
}