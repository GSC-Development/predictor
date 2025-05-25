// Team badge service for SPL teams
interface TeamInfo {
  name: string
  logo: string
  id: number
}

// SPL team logos from API-Football
const SPL_TEAMS: TeamInfo[] = [
  { id: 247, name: "Celtic", logo: "https://media.api-sports.io/football/teams/247.png" },
  { id: 249, name: "Hibernian", logo: "https://media.api-sports.io/football/teams/249.png" },
  { id: 250, name: "Kilmarnock", logo: "https://media.api-sports.io/football/teams/250.png" },
  { id: 251, name: "ST Mirren", logo: "https://media.api-sports.io/football/teams/251.png" },
  { id: 252, name: "Aberdeen", logo: "https://media.api-sports.io/football/teams/252.png" },
  { id: 253, name: "Dundee", logo: "https://media.api-sports.io/football/teams/253.png" },
  { id: 254, name: "Heart Of Midlothian", logo: "https://media.api-sports.io/football/teams/254.png" },
  { id: 255, name: "Livingston", logo: "https://media.api-sports.io/football/teams/255.png" },
  { id: 256, name: "Motherwell", logo: "https://media.api-sports.io/football/teams/256.png" },
  { id: 257, name: "Rangers", logo: "https://media.api-sports.io/football/teams/257.png" },
  { id: 258, name: "ST Johnstone", logo: "https://media.api-sports.io/football/teams/258.png" },
  { id: 901, name: "Partick", logo: "https://media.api-sports.io/football/teams/901.png" },
  { id: 902, name: "Ross County", logo: "https://media.api-sports.io/football/teams/902.png" },
  { id: 1385, name: "Raith Rovers", logo: "https://media.api-sports.io/football/teams/1385.png" },
  { id: 4668, name: "Airdrie United", logo: "https://media.api-sports.io/football/teams/4668.png" }
]

export const getTeamLogo = (teamName: string): string | null => {
  const team = SPL_TEAMS.find(t => 
    t.name.toLowerCase() === teamName.toLowerCase() ||
    t.name.toLowerCase().includes(teamName.toLowerCase()) ||
    teamName.toLowerCase().includes(t.name.toLowerCase())
  )
  return team?.logo || null
}

export const getAllSPLTeams = (): TeamInfo[] => {
  return SPL_TEAMS
}

export const getTeamById = (id: number): TeamInfo | null => {
  return SPL_TEAMS.find(t => t.id === id) || null
} 