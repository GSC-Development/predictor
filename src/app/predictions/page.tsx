"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PredictionCard } from "@/components/prediction-card"
import { useAuth } from "@/hooks/useAuth"
import { AuthForm } from "@/components/auth/auth-form"
import { UserHeader } from "@/components/user-header"
import { getNext6Fixtures } from "@/lib/demo-fixtures"
import { createPrediction, getUserPredictions, getUpcomingFixtures } from "@/lib/firestore"
import { Fixture, Prediction } from "@/types"

interface PredictionState {
  [fixtureId: string]: {
    homeScore: number
    awayScore: number
  }
}

export default function PredictionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  
  // Debug logging
  console.log('🎯 Predictions page auth state:', { 
    user: user ? { uid: user.uid, email: user.email } : null, 
    authLoading,
    mounted,
    timestamp: new Date().toISOString()
  });
  
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [currentPredictions, setCurrentPredictions] = useState<PredictionState>({})
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only load fixtures if user is authenticated
    if (user && !authLoading) {
      loadFixtures()
    } else if (!authLoading) {
      // If not authenticated, stop loading
      setLoading(false)
    }
  }, [user, authLoading])

  const loadFixtures = async () => {
    try {
      setLoading(true)
      // First try to get real fixtures from database
      const realFixtures = await getUpcomingFixtures('spl')
      
      let fixturesToUse: Fixture[]
      if (realFixtures.length > 0) {
        console.log(`Loaded ${realFixtures.length} real SPL fixtures`)
        fixturesToUse = realFixtures
      } else {
        console.log('No real fixtures found, using demo fixtures')
        fixturesToUse = getNext6Fixtures()
      }
      
      setFixtures(fixturesToUse)
      
      // Initialize current predictions with default scores
      const initialPredictions: PredictionState = {}
      fixturesToUse.forEach(fixture => {
        initialPredictions[fixture.fixtureId] = { homeScore: 0, awayScore: 0 }
      })
      setCurrentPredictions(initialPredictions)
    } catch (error) {
      console.error('Failed to load fixtures:', error)
      // Fallback to demo fixtures
      const demoFixtures = getNext6Fixtures()
      setFixtures(demoFixtures)
      
      const initialPredictions: PredictionState = {}
      demoFixtures.forEach(fixture => {
        initialPredictions[fixture.fixtureId] = { homeScore: 0, awayScore: 0 }
      })
      setCurrentPredictions(initialPredictions)
    } finally {
      setLoading(false)
    }
  }

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
      
      // Update current predictions with existing ones
      const updatedPredictions = { ...currentPredictions }
      userPredictions.forEach(prediction => {
        updatedPredictions[prediction.fixtureId] = {
          homeScore: prediction.homeScore,
          awayScore: prediction.awayScore
        }
      })
      setCurrentPredictions(updatedPredictions)
    } catch (error) {
      console.error("Failed to load predictions:", error)
    }
  }

  // Sign-in is now handled by the SignInForm component

  const handleScoreChange = (fixtureId: string, homeScore: number, awayScore: number) => {
    setCurrentPredictions(prev => ({
      ...prev,
      [fixtureId]: { homeScore, awayScore }
    }))
  }

  const handleSubmitAllPredictions = async () => {
    if (!user) {
      setError("Please sign in to submit predictions")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Submit all predictions
      const promises = fixtures.map(fixture => {
        const prediction = currentPredictions[fixture.fixtureId]
        if (!prediction) return Promise.resolve()

        const predictionData = {
          predictionId: `${user.uid}-${fixture.fixtureId}`,
          userId: user.uid,
          leagueId: "global",
          fixtureId: fixture.fixtureId,
          homeScore: prediction.homeScore,
          awayScore: prediction.awayScore,
          points: 0
        }

        return createPrediction(predictionData)
      })

      await Promise.all(promises)
      
      // Reload predictions to show updated data
      await loadUserPredictions()
      
      // Success message
      setError(null)
    } catch (error) {
      console.error("Failed to submit predictions:", error)
      setError(error instanceof Error ? error.message : "Failed to submit predictions")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getExistingPrediction = (fixtureId: string) => {
    return predictions.find(p => p.fixtureId === fixtureId)
  }

  const hasChanges = () => {
    return fixtures.some(fixture => {
      const current = currentPredictions[fixture.fixtureId]
      const existing = getExistingPrediction(fixture.fixtureId)
      
      if (!current) return false
      if (!existing) return current.homeScore > 0 || current.awayScore > 0
      
      return current.homeScore !== existing.homeScore || current.awayScore !== existing.awayScore
    })
  }

  const getAvailableMatches = () => {
    return fixtures.filter(fixture => {
      const now = Date.now()
      const kickOffTime = fixture.kickOffTime.toMillis()
      return kickOffTime > now
    })
  }

  const availableMatches = getAvailableMatches()

  if (!mounted || authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Make Predictions
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Sign in to predict exact scores for upcoming matches
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <AuthForm />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Make Predictions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            Predict exact scores for upcoming football matches
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <UserHeader />
          
          {fixtures.length === 0 ? (
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No upcoming fixtures available at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Prediction Cards Grid */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
                {fixtures.map((fixture) => {
                  const currentPrediction = currentPredictions[fixture.fixtureId]
                  const existingPrediction = getExistingPrediction(fixture.fixtureId)
                  
                  return (
                    <PredictionCard
                      key={fixture.fixtureId}
                      fixture={fixture}
                      homeScore={currentPrediction?.homeScore || 0}
                      awayScore={currentPrediction?.awayScore || 0}
                      onScoreChange={handleScoreChange}
                      existingPrediction={existingPrediction ? {
                        homeScore: existingPrediction.homeScore,
                        awayScore: existingPrediction.awayScore
                      } : undefined}
                    />
                  )
                })}
              </div>

              {/* Submit All Button */}
              {availableMatches.length > 0 && (
                <div className="flex flex-col items-center gap-4">
                  {error && (
                    <div className="w-full max-w-2xl p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm text-center">
                        <strong>Error:</strong> {error}
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleSubmitAllPredictions}
                    disabled={isSubmitting || !hasChanges()}
                    size="lg"
                    className="w-full max-w-md h-14 sm:h-16 text-lg sm:text-xl font-bold touch-manipulation bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Submitting Predictions...
                      </div>
                    ) : (
                      `Submit ${availableMatches.length} Predictions`
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Submit all your predictions at once. You can update them until kick-off.
                  </p>
                </div>
              )}

              {availableMatches.length === 0 && (
                <div className="text-center py-8">
                  <Card className="border-2 border-muted bg-muted/20 max-w-2xl mx-auto">
                    <CardContent className="py-8">
                      <p className="text-lg text-muted-foreground mb-4">
                        All matches have started - no more predictions allowed!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Check back later for the next round of fixtures.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
} 