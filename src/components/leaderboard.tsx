"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { subscribeToLeaderboard } from "@/lib/firestore"
import { Prediction } from "@/types"

interface LeaderboardEntry {
  userId: string
  userName: string
  totalPoints: number
  predictionsCount: number
  rank: number
}

interface LeaderboardProps {
  leagueId?: string | null
  title?: string
  maxEntries?: number
}

export function Leaderboard({ 
  leagueId = null, 
  title = "Global Leaderboard",
  maxEntries = 50 
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Subscribe to real-time leaderboard updates
    const unsubscribe = subscribeToLeaderboard(leagueId, (predictions: Prediction[]) => {
      try {
        const leaderboardData = processLeaderboardData(predictions)
        setEntries(leaderboardData.slice(0, maxEntries))
        setLoading(false)
      } catch {
        setError("Failed to process leaderboard data")
        setLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [leagueId, maxEntries])

  const processLeaderboardData = (predictions: Prediction[]): LeaderboardEntry[] => {
    // Group predictions by user
    const userStats = new Map<string, {
      totalPoints: number
      predictionsCount: number
      userName: string
    }>()

    predictions.forEach(prediction => {
      const existing = userStats.get(prediction.userId) || {
        totalPoints: 0,
        predictionsCount: 0,
        userName: `User ${prediction.userId.substring(0, 8)}` // Anonymous username
      }

      userStats.set(prediction.userId, {
        totalPoints: existing.totalPoints + prediction.points,
        predictionsCount: existing.predictionsCount + 1,
        userName: existing.userName
      })
    })

    // Convert to array and sort by points
    const leaderboardEntries: LeaderboardEntry[] = Array.from(userStats.entries())
      .map(([userId, stats]) => ({
        userId,
        userName: stats.userName,
        totalPoints: stats.totalPoints,
        predictionsCount: stats.predictionsCount,
        rank: 0 // Will be set below
      }))
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        // If points are equal, sort by predictions count (more predictions = higher rank)
        return b.predictionsCount - a.predictionsCount
      })

    // Assign ranks
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    return leaderboardEntries
  }

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "👑"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }



  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-muted-foreground">Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/20 bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No predictions yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to make a prediction!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-2xl">▪</span>
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Live rankings • {entries.length} predictors
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                ${entry.rank <= 3 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${entry.rank === 1 
                    ? 'bg-yellow-500 text-yellow-900' 
                    : entry.rank === 2 
                    ? 'bg-gray-400 text-gray-900'
                    : entry.rank === 3 
                    ? 'bg-orange-500 text-orange-900'
                    : 'bg-primary/20 text-primary'
                  }
                `}>
                  {entry.rank <= 3 ? getRankDisplay(entry.rank) : entry.rank}
                </div>
                <div>
                  <p className="font-medium">{entry.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.predictionsCount} prediction{entry.predictionsCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">{entry.totalPoints}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
        
        {entries.length >= maxEntries && (
          <div className="text-center mt-4 pt-4 border-t border-muted">
            <p className="text-sm text-muted-foreground">
              Showing top {maxEntries} predictors
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 