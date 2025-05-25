import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY
    const baseUrl = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io'

    if (!apiKey) {
      throw new Error('API_FOOTBALL_KEY environment variable is not set')
    }

    const response = await fetch(`${baseUrl}/teams?league=179&season=2023`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data: APIFootballTeamsResponse = await response.json()
    
    const teams = data.response.map(item => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo
    }))

    return NextResponse.json({ teams })

  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}