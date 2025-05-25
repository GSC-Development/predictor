// Results service with API abstraction
import { createMatchResult, getMatchResult, updatePredictionPoints, getAllResults } from '@/lib/firestore'
import { Timestamp } from 'firebase/firestore'
import type { CreateMatchResultData, MatchResult } from '@/types'

export interface ResultsProvider {
  fetchResult(fixtureId: string): Promise<MatchResult | null>
  fetchAllResults(): Promise<MatchResult[]>
}

// Manual provider for testing/demo
class ManualResultsProvider implements ResultsProvider {
  async fetchResult(fixtureId: string): Promise<MatchResult | null> {
    return await getMatchResult(fixtureId)
  }

  async fetchAllResults(): Promise<MatchResult[]> {
    return await getAllResults()
  }
}

// API-Football provider for live data
class APIResultsProvider implements ResultsProvider {
  constructor(private apiKey: string, private apiUrl: string) {}

  async fetchResult(fixtureId: string): Promise<MatchResult | null> {
    try {
      const response = await fetch(`${this.apiUrl}/fixtures?id=${fixtureId}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.response && data.response.length > 0) {
        const fixture = data.response[0]
        
        // Only return result if match is finished
        if (fixture.fixture.status.short === 'FT') {
          return {
            fixtureId,
            homeScore: fixture.goals.home || 0,
            awayScore: fixture.goals.away || 0,
            isFinished: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching result from API:', error)
      return null
    }
  }

  async fetchAllResults(): Promise<MatchResult[]> {
    try {
      // Fetch finished matches from current season
      const response = await fetch(`${this.apiUrl}/fixtures?league=179&season=2025&status=FT`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      const results: MatchResult[] = []
      
      if (data.response) {
        for (const fixture of data.response) {
          if (fixture.fixture.status.short === 'FT') {
            results.push({
              fixtureId: fixture.fixture.id.toString(),
              homeScore: fixture.goals.home || 0,
              awayScore: fixture.goals.away || 0,
              isFinished: true,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            })
          }
        }
      }
      
      return results
    } catch (error) {
      console.error('Error fetching all results from API:', error)
      return []
    }
  }
}

// Service class that uses the appropriate provider
class ResultsService {
  private provider: ResultsProvider

  constructor(provider: ResultsProvider) {
    this.provider = provider
  }

  async submitResult(resultData: CreateMatchResultData): Promise<void> {
    // Create the result in our database
    await createMatchResult(resultData)
    
    // Update prediction points for all users
    const result = { 
      homeScore: resultData.homeScore, 
      awayScore: resultData.awayScore 
    } as MatchResult
    
    await updatePredictionPoints(resultData.fixtureId, result)
  }

  async getResult(fixtureId: string): Promise<MatchResult | null> {
    return await this.provider.fetchResult(fixtureId)
  }

  async getAllResults(): Promise<MatchResult[]> {
    return await this.provider.fetchAllResults()
  }

  // Method to switch providers (for future API integration)
  setProvider(provider: ResultsProvider): void {
    this.provider = provider
  }
}

// Export singleton instance with manual provider for now
export const resultsService = new ResultsService(new ManualResultsProvider())

// Export providers for future use
export { ManualResultsProvider, APIResultsProvider } 