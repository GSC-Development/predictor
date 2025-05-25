import { apiFootballService } from './api-football'
import { createFixture, createMatchResult, updatePredictionPoints } from '@/lib/firestore'

class SyncService {
  async syncUpcomingFixtures(): Promise<void> {
    try {
      console.log('Syncing upcoming fixtures from API-Football...')
      const fixtures = await apiFootballService.fetchUpcomingFixtures()
      
      for (const fixtureData of fixtures) {
        try {
          await createFixture(fixtureData)
          console.log(`Created fixture: ${fixtureData.homeTeam} vs ${fixtureData.awayTeam}`)
        } catch (error) {
          // Fixture might already exist, that's okay
          console.log(`Fixture already exists: ${fixtureData.homeTeam} vs ${fixtureData.awayTeam}`)
        }
      }
      
      console.log(`Successfully synced ${fixtures.length} upcoming fixtures`)
    } catch (error) {
      console.error('Error syncing upcoming fixtures:', error)
    }
  }

  async syncFinishedResults(): Promise<void> {
    try {
      console.log('Syncing finished results from API-Football...')
      const finishedFixtures = await apiFootballService.fetchFinishedFixtures()
      
      for (const fixture of finishedFixtures) {
        try {
          // Create match result
          const resultData = {
            fixtureId: fixture.fixtureId,
            homeScore: fixture.homeScore || 0,
            awayScore: fixture.awayScore || 0,
            isFinished: true
          }
          
          await createMatchResult(resultData)
          
          // Update prediction points for this fixture
          const result = {
            homeScore: fixture.homeScore || 0,
            awayScore: fixture.awayScore || 0
          }
          
          await updatePredictionPoints(fixture.fixtureId, result as any)
          
          console.log(`Processed result: ${fixture.homeTeam} ${fixture.homeScore}-${fixture.awayScore} ${fixture.awayTeam}`)
        } catch (error) {
          // Result might already exist, that's okay
          console.log(`Result already processed: ${fixture.homeTeam} vs ${fixture.awayTeam}`)
        }
      }
      
      console.log(`Successfully synced ${finishedFixtures.length} finished results`)
    } catch (error) {
      console.error('Error syncing finished results:', error)
    }
  }

  async syncLastMatchday(): Promise<void> {
    try {
      console.log('Syncing final matchday fixtures (May 22-26, 2024)...')
      const fixtures = await apiFootballService.fetchLastMatchday()
      
      console.log(`Fetched ${fixtures.length} fixtures from API`)
      fixtures.forEach(f => console.log(`- ${f.homeTeam} vs ${f.awayTeam} (ID: ${f.fixtureId}, Status: ${f.status})`))
      
      for (const fixtureData of fixtures) {
        try {
          await createFixture(fixtureData)
          console.log(`✅ Created fixture: ${fixtureData.homeTeam} vs ${fixtureData.awayTeam} (${fixtureData.status})`)
        } catch (error) {
          console.log(`⚠️ Fixture already exists: ${fixtureData.homeTeam} vs ${fixtureData.awayTeam}`)
        }
      }
      
      console.log(`Successfully synced ${fixtures.length} final matchday fixtures`)
    } catch (error) {
      console.error('Error syncing final matchday:', error)
    }
  }

  async syncTeams(): Promise<{ id: number; name: string; logo: string }[]> {
    try {
      console.log('Syncing SPL teams and badges...')
      const teams = await apiFootballService.fetchTeams()
      
      console.log('SPL Teams with badges:')
      teams.forEach(team => {
        console.log(`${team.name}: ${team.logo}`)
      })
      
      console.log(`Successfully fetched ${teams.length} SPL teams`)
      return teams
    } catch (error) {
      console.error('Error syncing teams:', error)
      return []
    }
  }

  async syncAll(): Promise<void> {
    console.log('Starting full sync...')
    await this.syncUpcomingFixtures()
    await this.syncFinishedResults()
    console.log('Full sync completed!')
  }

  // Run sync every 15 minutes in production
  startPeriodicSync(): void {
    console.log('Starting periodic sync (every 15 minutes)...')
    
    // Initial sync
    this.syncAll()
    
    // Schedule periodic syncs
    setInterval(() => {
      this.syncAll()
    }, 15 * 60 * 1000) // 15 minutes
  }
}

export const syncService = new SyncService() 