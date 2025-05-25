// src/types/index.ts
import { Timestamp } from "firebase/firestore";

export interface User {
  id?: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: Timestamp;
  totalPoints: number;
  currentWeekPoints: number;
  rank?: number;
}

export interface League {
  id?: string;
  leagueId: string;
  name: string;
  inviteCode: string;
  adminId: string;
  isPublic: boolean;
  memberCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Fixture {
  id?: string;
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: Timestamp;
  matchDate: Timestamp;
  leagueType: string; // e.g., "spl", "premier-league", "champions-league"
  gameweek: number;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "finished";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Prediction {
  id?: string;
  predictionId: string;
  userId: string;
  leagueId: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  points: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create types (without id and timestamps)
export interface CreateUserData {
  userId: string;
  name: string;
  email: string;
  joinedAt: Timestamp;
  totalPoints: number;
  currentWeekPoints: number;
}

export interface CreateLeagueData {
  leagueId: string;
  name: string;
  inviteCode: string;
  adminId: string;
  isPublic: boolean;
  memberCount: number;
}

export interface CreateFixtureData {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: Timestamp;
  matchDate: Timestamp;
  leagueType: string;
  gameweek: number;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "finished";
}

export interface CreatePredictionData {
  predictionId: string;
  userId: string;
  leagueId: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  points: number;
} 