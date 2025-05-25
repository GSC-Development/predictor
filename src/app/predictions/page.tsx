"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PredictionCard } from "@/components/prediction-card"
import { useAuth } from "@/hooks/useAuth"
import { getNext6Fixtures } from "@/lib/demo-fixtures"
import { createPrediction, getUserPredictions } from "@/lib/firestore"
import { Fixture, Prediction } from "@/types"

export default function PredictionsPage() {
  const { user, signInAnonymous, loading: authLoading } = useAuth()
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load demo fixtures
    const demoFixtures = getNext6Fixtures()
    setFixtures(demoFixtures)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Load user predictions if authenticated
    if (user) {
      loadUserPredictions()
    }
  }, [user])

  const loadUserPredictions = async () => {
    if (!user) return
    
    try {
      const userPredictions = await getUserPredictions(user.uid)
      setPredictions(userPredictions)
    } catch (error) {
      console.error("Failed to load predictions:", error)
    }
  }

  const handlePredictionSubmit = async (fixtureId: string, homeScore: number, awayScore: number) => {
    if (!user) {
      throw new Error("Please sign in to submit predictions")
    }

    try {
      const predictionData = {
        predictionId: `${user.uid}-${fixtureId}`,
        userId: user.uid,
        leagueId: "global", // Default global league
        fixtureId,
        homeScore,
        awayScore,
        points: 0 // Points will be calculated after match ends
      }

      await createPrediction(predictionData)
      
      // Reload predictions to show updated data
      await loadUserPredictions()
    } catch (error) {
      console.error("Failed to submit prediction:", error)
      throw error
    }
  }

  const getExistingPrediction = (fixtureId: string) => {
    return predictions.find(p => p.fixtureId === fixtureId)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
        <main className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
        <main className="container mx-auto px-6 py-16">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Make Predictions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Sign in to predict exact scores for upcoming matches across different leagues
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground text-center leading-relaxed">
                  Sign in to start making predictions and compete with players worldwide.
                </p>
                
                <Button
                  onClick={signInAnonymous}
                  size="lg"
                  className="w-full"
                >
                  Sign In & Start Predicting
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Quick anonymous sign-in - no email required
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Make Predictions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            Predict exact scores for the next 6 matches - Super 6 style!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {fixtures.length === 0 ? (
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No upcoming fixtures available at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fixtures.map((fixture) => {
                const existingPrediction = getExistingPrediction(fixture.fixtureId)
                return (
                  <PredictionCard
                    key={fixture.fixtureId}
                    fixture={fixture}
                    onSubmit={handlePredictionSubmit}
                    existingPrediction={existingPrediction ? {
                      homeScore: existingPrediction.homeScore,
                      awayScore: existingPrediction.awayScore
                    } : undefined}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 