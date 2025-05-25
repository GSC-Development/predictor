// src/types/index.ts
export interface User {
  userId: string;
  name: string;
  email: string;
  joinedAt: Date;
  totalPoints: number;
  currentStreak: number;
  avatar: string | null;
}

export interface League {
  leagueId: string;
  name: string;
  inviteCode: string;
  adminId: string;
  members: string[];
  createdAt: Date;
  isPublic: boolean;
}

export interface Fixture {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: Date;
  gameweek: number;
  status: 'upcoming' | 'live' | 'finished';
  homeScore: number | null;
  awayScore: number | null;
  lastUpdated: Date;
}

export interface Prediction {
  predictionId: string;
  userId: string;
  leagueId: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  submittedAt: Date;
  points: number | null;
} 