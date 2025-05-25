import type { CreateFixtureData } from '@/types'

interface APIResponse<T> {
  fixtures?: T
  teams?: T
  error?: string
}

class APIFootballService {
  private async makeRequest<T>(endpoint: string, params?: URLSearchParams): Promise<T[]> {
    const url = new URL('/api' + endpoint, window.location.origin)
    if (params) {
      params.forEach((value, key) => url.searchParams.set(key, value))
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API request failed: ${response.status}`)
    }

    const data: APIResponse<T[]> = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data.fixtures || data.teams || []
  }

  async fetchUpcomingFixtures(): Promise<CreateFixtureData[]> {
    try {
      const params = new URLSearchParams({ type: 'upcoming' })
      return await this.makeRequest<CreateFixtureData>('/fixtures', params)
    } catch (error) {
      console.error('Error fetching upcoming fixtures:', error)
      return []
    }
  }

  async fetchFixturesByDateRange(from: string, to: string): Promise<CreateFixtureData[]> {
    try {
      console.log(`Making API call: /fixtures with daterange from=${from}&to=${to}`)
      const params = new URLSearchParams({ 
        type: 'daterange',
        from,
        to
      })
      const data = await this.makeRequest<CreateFixtureData>('/fixtures', params)
      console.log(`API returned ${data.length} fixtures`)
      return data
    } catch (error) {
      console.error('Error fetching fixtures by date range:', error)
      return []
    }
  }

  async fetchLastMatchday(): Promise<CreateFixtureData[]> {
    try {
      const params = new URLSearchParams({ type: 'lastmatchday' })
      return await this.makeRequest<CreateFixtureData>('/fixtures', params)
    } catch (error) {
      console.error('Error fetching last matchday:', error)
      return []
    }
  }

  async fetchLiveFixtures(): Promise<CreateFixtureData[]> {
    try {
      const params = new URLSearchParams({ type: 'live' })
      return await this.makeRequest<CreateFixtureData>('/fixtures', params)
    } catch (error) {
      console.error('Error fetching live fixtures:', error)
      return []
    }
  }

  async fetchFinishedFixtures(): Promise<CreateFixtureData[]> {
    try {
      const params = new URLSearchParams({ type: 'finished' })
      return await this.makeRequest<CreateFixtureData>('/fixtures', params)
    } catch (error) {
      console.error('Error fetching finished fixtures:', error)
      return []
    }
  }

  async fetchTeams(): Promise<{ id: number; name: string; logo: string }[]> {
    try {
      return await this.makeRequest<{ id: number; name: string; logo: string }>('/teams')
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }
}

export const apiFootballService = new APIFootballService() 