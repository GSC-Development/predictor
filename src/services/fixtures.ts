import { getUpcomingFixtures } from '@/lib/firestore'
import { apiFootballService } from './api-football'
import type { Fixture } from '@/types'

class FixturesService {
  async getUpcomingFixtures(leagueType?: string): Promise<Fixture[]> {
    // First try to get from database
    const dbFixtures = await getUpcomingFixtures(leagueType)
    
    // If no fixtures in database, try to sync from API
    if (dbFixtures.length === 0) {
      try {
        console.log('No fixtures in database, syncing from API...')
        const apiFixtures = await apiFootballService.fetchUpcomingFixtures()
        // Note: We're not storing them here to avoid duplicate keys
        // The sync API route should be used for storing fixtures
        console.log(`Found ${apiFixtures.length} fixtures from API`)
      } catch (error) {
        console.error('Error syncing fixtures from API:', error)
      }
    }
    
    return dbFixtures
  }
}

export const fixturesService = new FixturesService() 