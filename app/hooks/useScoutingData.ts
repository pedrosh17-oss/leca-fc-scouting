'use client';

import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { createClient } from '@supabase/supabase-js';
import { Player, Team, Match, Scout, MarketOpportunity, Role } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zlvakhbqskmsubxmyvvr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TBhrZLVa7hAP3EPrDrAbiQ_mI2v_egy';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getRoleForUser(name: string): Role {
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

export function useScoutingData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [marketOpportunities, setMarketOpportunities] = useState<MarketOpportunity[]>([]);
  const [algorithmData, setAlgorithmData] = useState<Record<string, { tag: string; row: any }[]>>({});
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScoutId, setAuthScoutId] = useState<string | null>(null);
  const [authScoutName, setAuthScoutName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>('SCOUT');

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
  }, []);

  return {
    players, setPlayers,
    teams, setTeams,
    matches, setMatches,
    competitions, setCompetitions,
    scouts, setScouts,
    marketOpportunities, setMarketOpportunities,
    algorithmData, setAlgorithmData,
    loading,
    isAuthenticated, setIsAuthenticated,
    authScoutId, setAuthScoutId,
    authScoutName, setAuthScoutName,
    userRole, setUserRole,
    loadData
  };
}