export type Role = 'ADMIN' | 'DIRECTOR' | 'EXECUTIVE' | 'SCOUT';

export interface Player {
  id: string;
  name: string;
  club?: string;
  clubLogo?: string;
  position?: string;
  status?: string;
  age?: string | number;
  birthDate?: string;
  birth_date?: string;
  dataNascimento?: string;
  data_nascimento?: string;
  birthYear?: string | number;
  nationality?: string;
  foot?: string;
  height?: string;
  photo?: string;
  finalReport?: string;
}

export interface Team {
  id: string;
  name: string;
  competition?: string;
  country?: string;
  logo?: string;
  status?: string;
}

export interface Match {
  id: string;
  matchName: string;
  gameDate: string;
  competition?: string;
  type?: string;
  homeTactic?: string;
  awayTactic?: string;
  tempo?: string;
  intensity?: string;
  technical?: string;
  pressure?: string;
  scout?: string;
  playersCount?: number;
  notes?: string;
  highlightedPlayers?: Array<{
    id: string;
    name: string;
    note?: string;
    highlightId?: string | null;
    photo?: string;
    position?: string;
    club?: string;
  }>;
}

export interface Scout {
  id: string;
  name: string;
  photo?: string;
  liveMatches?: number;
  streamMatches?: number;
}

export interface MarketOpportunity {
  id: string;
  fields: Record<string, any>;
}

export interface DecisionFormData {
  status: string;
  vetoReason: string;
  vetoDate: string;
  presidentOpinion: string;
  notesDD: string;
}

export interface MarketFormData {
  playerId: string;
  name: string;
  club: string;
  position: string;
  foot: string;
  birthDate: string;
  offerDate: string;
  marketTarget: string;
  scout: string;
  viability: string;
  confLiga3: string;
  confLiga2: string;
  contract: string;
  utilization: string;
  strengths: string;
  weaknesses: string;
  reason: string;
  similarity: string;
  mental: string;
}