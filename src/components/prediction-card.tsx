"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fixture } from "@/types"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"
import { getTeamLogo } from "@/services/teams"
import Image from "next/image"

interface PredictionCardProps {
  fixture: Fixture
  homeScore: number
  awayScore: number
  onScoreChange: (fixtureId: string, homeScore: number, awayScore: number) => void
  existingPrediction?: {
    homeScore: number
    awayScore: number
  }
  disabled?: boolean
}

export function PredictionCard({ 
  fixture, 
  homeScore,
  awayScore,
  onScoreChange,
  existingPrediction, 
  disabled = false 
}: PredictionCardProps) {

  const formatKickOffTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return format(date, "EEE, MMM d 'at' HH:mm")
  }

  const isMatchStarted = () => {
    return Timestamp.now().toMillis() > fixture.kickOffTime.toMillis()
  }

  const matchStarted = isMatchStarted()

  const adjustScore = (team: 'home' | 'away', delta: number) => {
    if (disabled || matchStarted) return
    
    const newHomeScore = team === 'home' ? Math.max(0, Math.min(20, homeScore + delta)) : homeScore
    const newAwayScore = team === 'away' ? Math.max(0, Math.min(20, awayScore + delta)) : awayScore
    
    onScoreChange(fixture.fixtureId, newHomeScore, newAwayScore)
  }

  return (
    <Card className={`
      border-2 transition-all duration-300 
      ${matchStarted 
        ? 'border-muted bg-muted/20' 
        : 'border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      }
    `}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-center">
          <div className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider mb-2">
            {fixture.leagueType}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-normal mb-3">
            {formatKickOffTime(fixture.kickOffTime)}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6 pb-6">
        {matchStarted ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Match has started</p>
            {existingPrediction && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-sm font-medium mb-2">Your prediction:</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-1 mb-2">
                      {getTeamLogo(fixture.homeTeam) && (
                        <Image
                          src={getTeamLogo(fixture.homeTeam)!}
                          alt={`${fixture.homeTeam} logo`}
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                      )}
                      <div className="text-xs text-muted-foreground truncate max-w-16">{fixture.homeTeam}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{existingPrediction.homeScore}</div>
                  </div>
                  <div className="text-xl font-bold text-muted-foreground">-</div>
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-1 mb-2">
                      {getTeamLogo(fixture.awayTeam) && (
                        <Image
                          src={getTeamLogo(fixture.awayTeam)!}
                          alt={`${fixture.awayTeam} logo`}
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                      )}
                      <div className="text-xs text-muted-foreground truncate max-w-16">{fixture.awayTeam}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{existingPrediction.awayScore}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Team Names and Score Controls */}
            <div className="space-y-4">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getTeamLogo(fixture.homeTeam) && (
                    <Image
                      src={getTeamLogo(fixture.homeTeam)!}
                      alt={`${fixture.homeTeam} logo`}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                  )}
                  <div className="text-sm sm:text-base font-semibold text-primary truncate">
                    {fixture.homeTeam}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 touch-manipulation border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => adjustScore('home', -1)}
                    disabled={disabled || homeScore <= 0}
                  >
                    <span className="text-lg font-bold">-</span>
                  </Button>
                  <div className="w-12 sm:w-16 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">{homeScore}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 touch-manipulation border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => adjustScore('home', 1)}
                    disabled={disabled || homeScore >= 20}
                  >
                    <span className="text-lg font-bold">+</span>
                  </Button>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getTeamLogo(fixture.awayTeam) && (
                    <Image
                      src={getTeamLogo(fixture.awayTeam)!}
                      alt={`${fixture.awayTeam} logo`}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                  )}
                  <div className="text-sm sm:text-base font-semibold text-primary truncate">
                    {fixture.awayTeam}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 touch-manipulation border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => adjustScore('away', -1)}
                    disabled={disabled || awayScore <= 0}
                  >
                    <span className="text-lg font-bold">-</span>
                  </Button>
                  <div className="w-12 sm:w-16 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">{awayScore}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 touch-manipulation border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => adjustScore('away', 1)}
                    disabled={disabled || awayScore >= 20}
                  >
                    <span className="text-lg font-bold">+</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing Prediction Indicator */}
            {existingPrediction && (
              <div className="mt-4 text-center text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/20">
                Previously: {existingPrediction.homeScore} - {existingPrediction.awayScore}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 