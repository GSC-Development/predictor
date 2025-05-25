"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Fixture } from "@/types"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"

interface PredictionCardProps {
  fixture: Fixture
  onSubmit: (fixtureId: string, homeScore: number, awayScore: number) => Promise<void>
  existingPrediction?: {
    homeScore: number
    awayScore: number
  }
  disabled?: boolean
}

export function PredictionCard({ 
  fixture, 
  onSubmit, 
  existingPrediction, 
  disabled = false 
}: PredictionCardProps) {
  const [homeScore, setHomeScore] = useState(existingPrediction?.homeScore?.toString() || "")
  const [awayScore, setAwayScore] = useState(existingPrediction?.awayScore?.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = homeScore !== "" && awayScore !== "" && 
                  !isNaN(Number(homeScore)) && !isNaN(Number(awayScore)) &&
                  Number(homeScore) >= 0 && Number(awayScore) >= 0

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(fixture.fixtureId, Number(homeScore), Number(awayScore))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit prediction")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatKickOffTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return format(date, "EEE, MMM d 'at' HH:mm")
  }

  const isMatchStarted = () => {
    return Timestamp.now().toMillis() > fixture.kickOffTime.toMillis()
  }

  const matchStarted = isMatchStarted()

  return (
    <Card className={`
      border-2 transition-all duration-300 
      ${matchStarted 
        ? 'border-muted bg-muted/20' 
        : 'border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]'
      }
    `}>
      <CardHeader className="pb-4">
        <CardTitle className="text-center">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-primary">{fixture.homeTeam}</span>
            <span className="text-muted-foreground mx-4">vs</span>
            <span className="text-primary">{fixture.awayTeam}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-normal">
            {formatKickOffTime(fixture.kickOffTime)}
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-normal uppercase tracking-wide">
            {fixture.leagueType} • Gameweek {fixture.gameweek}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {matchStarted ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Match has started</p>
            {existingPrediction && (
              <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium">Your prediction: </span>
                <span className="font-bold text-primary">
                  {existingPrediction.homeScore} - {existingPrediction.awayScore}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Score Inputs */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  {fixture.homeTeam}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="w-16 text-center text-lg font-bold"
                  disabled={disabled || isSubmitting}
                  placeholder="0"
                />
              </div>
              
              <div className="text-2xl font-bold text-muted-foreground">-</div>
              
              <div className="text-center">
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  {fixture.awayTeam}
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="w-16 text-center text-lg font-bold"
                  disabled={disabled || isSubmitting}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || disabled}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : existingPrediction ? (
                "Update Prediction"
              ) : (
                "Submit Prediction"
              )}
            </Button>

            {/* Existing Prediction Display */}
            {existingPrediction && !error && (
              <div className="text-center text-sm text-muted-foreground">
                Current prediction: {existingPrediction.homeScore} - {existingPrediction.awayScore}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 