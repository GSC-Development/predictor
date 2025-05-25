import { Timestamp } from 'firebase/firestore'
import type { CreateFixtureData } from '@/types'

interface APIFootballTeam {
  team: {
    id: number
    name: string
    logo: string
  }
}

interface APIFootballTeamsResponse {
  response: APIFootballTeam[]
}

interface APIFootballFixture {
  fixture: {
    id: number
    date: string
    status: {
      short: string
    }
    venue: {
      name: string
    }
  }
  teams: {
    home: {
      name: string
    }
    away: {
      name: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  league: {
    round: string
  }
}

interface APIFootballResponse {
  response: APIFootballFixture[]
}

class APIFootballService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY || process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || 'dbd13cc8237bd43f4f461560e1d814b9'
    this.baseUrl = process.env.API_FOOTBALL_BASE_URL || process.env.NEXT_PUBLIC_API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io'
  }

  private async makeRequest(endpoint: string): Promise<APIFootballResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  async fetchUpcomingFixtures(): Promise<CreateFixtureData[]> {
    try {
      const data = await this.makeRequest('/fixtures?league=179&season=2023&status=NS')
      
      return data.response.map(fixture => ({
        fixtureId: fixture.fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        kickOffTime: Timestamp.fromDate(new Date(fixture.fixture.date)),
        matchDate: Timestamp.fromDate(new Date(fixture.fixture.date)),
        leagueType: 'spl',
        gameweek: this.extractGameweek(fixture.league.round),
        status: 'upcoming' as const
      }))
    } catch (error) {
      console.error('Error fetching upcoming fixtures:', error)
      return []
    }
  }

  async fetchFixturesByDateRange(from: string, to: string): Promise<CreateFixtureData[]> {
    try {
      console.log(`Making API call: /fixtures?league=179&season=2023&from=${from}&to=${to}`)
      const data = await this.makeRequest(`/fixtures?league=179&season=2023&from=${from}&to=${to}`)
      console.log(`API returned ${data.response.length} fixtures`)
      
      return data.response.map(fixture => ({
        fixtureId: fixture.fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        kickOffTime: Timestamp.fromDate(new Date(fixture.fixture.date)),
        matchDate: Timestamp.fromDate(new Date(fixture.fixture.date)),
        leagueType: 'spl',
        gameweek: this.extractGameweek(fixture.league.round),
        homeScore: fixture.goals.home || undefined,
        awayScore: fixture.goals.away || undefined,
        status: fixture.fixture.status.short === 'FT' ? 'finished' as const : 
                fixture.fixture.status.short === 'LIVE' ? 'live' as const : 'upcoming' as const
      }))
    } catch (error) {
      console.error('Error fetching fixtures by date range:', error)
      return []
    }
  }

  async fetchLastMatchday(): Promise<CreateFixtureData[]> {
    // SPL 2023 season ended on May 26, 2024 - fetch final week
    return this.fetchFixturesByDateRange('2024-05-22', '2024-05-26')
  }

  async fetchLiveFixtures(): Promise<CreateFixtureData[]> {
    try {
      const data = await this.makeRequest('/fixtures?league=179&live=all')
      
      return data.response.map(fixture => ({
        fixtureId: fixture.fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        kickOffTime: Timestamp.fromDate(new Date(fixture.fixture.date)),
        matchDate: Timestamp.fromDate(new Date(fixture.fixture.date)),
        leagueType: 'spl',
        gameweek: this.extractGameweek(fixture.league.round),
        homeScore: fixture.goals.home || 0,
        awayScore: fixture.goals.away || 0,
        status: 'live' as const
      }))
    } catch (error) {
      console.error('Error fetching live fixtures:', error)
      return []
    }
  }

  async fetchFinishedFixtures(): Promise<CreateFixtureData[]> {
    try {
      const data = await this.makeRequest('/fixtures?league=179&season=2023&status=FT')
      
      return data.response.map(fixture => ({
        fixtureId: fixture.fixture.id.toString(),
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        kickOffTime: Timestamp.fromDate(new Date(fixture.fixture.date)),
        matchDate: Timestamp.fromDate(new Date(fixture.fixture.date)),
        leagueType: 'spl',
        gameweek: this.extractGameweek(fixture.league.round),
        homeScore: fixture.goals.home || 0,
        awayScore: fixture.goals.away || 0,
        status: 'finished' as const
      }))
    } catch (error) {
      console.error('Error fetching finished fixtures:', error)
      return []
    }
  }

  async fetchTeams(): Promise<{ id: number; name: string; logo: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/teams?league=179&season=2023`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const data: APIFootballTeamsResponse = await response.json()
      
      return data.response.map(item => ({
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logo
      }))
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }

  private extractGameweek(round: string): number {
    // Extract gameweek number from round string like "Regular Season - 15"
    const match = round.match(/(\d+)/)
    return match ? parseInt(match[1]) : 1
  }
}

export const apiFootballService = new APIFootballService() 