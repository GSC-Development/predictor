import { Fixture } from "@/types"
import { Timestamp } from "firebase/firestore"

// Scottish Premier League teams
const splTeams = [
  "Celtic", "Rangers", "Aberdeen", "Hearts", "Hibernian", 
  "St Mirren", "Dundee United", "Motherwell", "Kilmarnock",
  "St Johnstone", "Ross County", "Livingston"
]

// Generate demo fixtures for the next few gameweeks
export const generateDemoFixtures = (): Fixture[] => {
  const fixtures: Fixture[] = []
  const now = new Date()
  
  // Generate fixtures for next 3 gameweeks
  for (let gameweek = 1; gameweek <= 3; gameweek++) {
    const baseDate = new Date(now)
    baseDate.setDate(now.getDate() + (gameweek - 1) * 7) // Each gameweek is 7 days apart
    
    // Create 6 matches per gameweek (12 teams = 6 matches)
    const shuffledTeams = [...splTeams].sort(() => Math.random() - 0.5)
    
    for (let match = 0; match < 6; match++) {
      const homeTeam = shuffledTeams[match * 2]
      const awayTeam = shuffledTeams[match * 2 + 1]
      
      // Spread matches across Saturday and Sunday
      const matchDate = new Date(baseDate)
      if (match < 3) {
        // Saturday matches
        matchDate.setDate(baseDate.getDate() + (gameweek === 1 ? 0 : 0)) // This Saturday
        matchDate.setHours(15 + (match % 2), match % 2 === 0 ? 0 : 30, 0, 0) // 15:00, 15:30, 16:00
      } else {
        // Sunday matches
        matchDate.setDate(baseDate.getDate() + (gameweek === 1 ? 1 : 1)) // This Sunday
        matchDate.setHours(14 + ((match - 3) % 2), (match - 3) % 2 === 0 ? 0 : 30, 0, 0) // 14:00, 14:30, 15:00
      }
      
      fixtures.push({
        id: `fixture-${gameweek}-${match}`,
        fixtureId: `spl-2024-gw${gameweek}-${match}`,
        homeTeam,
        awayTeam,
        kickOffTime: Timestamp.fromDate(matchDate),
        matchDate: Timestamp.fromDate(matchDate),
        leagueType: "Scottish Premier League",
        gameweek,
        status: "upcoming",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    }
  }
  
  return fixtures.sort((a, b) => a.kickOffTime.toMillis() - b.kickOffTime.toMillis())
}

// Get fixtures for a specific gameweek
export const getFixturesByGameweek = (gameweek: number): Fixture[] => {
  return generateDemoFixtures().filter(fixture => fixture.gameweek === gameweek)
}

// Get next 6 upcoming fixtures (Super 6 style)
export const getNext6Fixtures = (): Fixture[] => {
  const allFixtures = generateDemoFixtures()
  const upcomingFixtures = allFixtures.filter(fixture => 
    fixture.kickOffTime.toMillis() > Date.now()
  )
  return upcomingFixtures.slice(0, 6)
} 