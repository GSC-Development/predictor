import { NextRequest, NextResponse } from 'next/server'
import { Timestamp } from 'firebase/firestore'
import type { CreateFixtureData } from '@/types'

interface APIFootballFixture {
  fixture: {
    id: number
    date: string
    status: {
      short: string
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

function extractGameweek(round: string): number {
  const match = round.match(/(\d+)/)
  return match ? parseInt(match[1]) : 1
}

async function makeAPIRequest(endpoint: string): Promise<APIFootballResponse> {
  const apiKey = process.env.API_FOOTBALL_KEY
  const baseUrl = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io'

  if (!apiKey) {
    throw new Error('API_FOOTBALL_KEY environment variable is not set')
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'v3.football.api-sports.io'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed: ${response.status} - ${errorText}`)
  }

  return response.json()
}

function transformFixture(fixture: APIFootballFixture): CreateFixtureData {
  return {
    fixtureId: fixture.fixture.id.toString(),
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    kickOffTime: Timestamp.fromDate(new Date(fixture.fixture.date)),
    matchDate: Timestamp.fromDate(new Date(fixture.fixture.date)),
    leagueType: 'spl',
    gameweek: extractGameweek(fixture.league.round),
    homeScore: fixture.goals.home || undefined,
    awayScore: fixture.goals.away || undefined,
    status: fixture.fixture.status.short === 'FT' ? 'finished' as const : 
            fixture.fixture.status.short === 'LIVE' ? 'live' as const : 'upcoming' as const
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'upcoming'
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let endpoint = ''
    
    switch (type) {
      case 'upcoming':
        endpoint = '/fixtures?league=179&season=2023&status=NS'
        break
      case 'live':
        endpoint = '/fixtures?league=179&live=all'
        break
      case 'finished':
        endpoint = '/fixtures?league=179&season=2023&status=FT'
        break
      case 'daterange':
        if (!from || !to) {
          return NextResponse.json(
            { error: 'from and to parameters are required for daterange type' },
            { status: 400 }
          )
        }
        endpoint = `/fixtures?league=179&season=2023&from=${from}&to=${to}`
        break
      case 'lastmatchday':
        endpoint = '/fixtures?league=179&season=2023&from=2024-05-22&to=2024-05-26'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }

    const data = await makeAPIRequest(endpoint)
    const fixtures = data.response.map(transformFixture)

    return NextResponse.json({ fixtures })

  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    )
  }
}