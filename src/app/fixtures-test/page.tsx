"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUpcomingFixtures } from "@/lib/firestore"
import { Fixture } from "@/types"
import { format } from "date-fns"
import { getTeamLogo } from "@/services/teams"
import Image from "next/image"

export default function FixturesTestPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFixtures()
  }, [])

  const loadFixtures = async () => {
    try {
      setLoading(true)
      const splFixtures = await getUpcomingFixtures('spl')
      console.log(`Loaded ${splFixtures.length} SPL fixtures from database`)
      setFixtures(splFixtures)
    } catch (err) {
      console.error('Failed to load fixtures:', err)
      setError(err instanceof Error ? err.message : 'Failed to load fixtures')
    } finally {
      setLoading(false)
    }
  }

  const syncFixtures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sync?action=lastmatchday', {
        method: 'POST'
      })
      const result = await response.json()
      console.log('Sync result:', result)
      
      // Reload fixtures after sync
      await loadFixtures()
    } catch (err) {
      console.error('Sync failed:', err)
      setError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fixtures Test
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Testing real SPL fixtures from database
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={loadFixtures} disabled={loading}>
              Reload Fixtures
            </Button>
            <Button onClick={syncFixtures} disabled={loading} variant="outline">
              Sync from API
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10 mb-6">
            <CardContent className="pt-6">
              <p className="text-destructive font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Fixtures ({fixtures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {fixtures.length === 0 ? (
                <p className="text-muted-foreground">No fixtures found in database</p>
              ) : (
                <div className="space-y-4">
                  {fixtures.map(fixture => (
                    <div key={fixture.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTeamLogo(fixture.homeTeam) && (
                            <Image
                              src={getTeamLogo(fixture.homeTeam)!}
                              alt={`${fixture.homeTeam} logo`}
                              width={32}
                              height={32}
                              className="rounded-sm"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{fixture.homeTeam}</p>
                            <p className="text-sm text-muted-foreground">vs</p>
                            <p className="font-semibold">{fixture.awayTeam}</p>
                          </div>
                          {getTeamLogo(fixture.awayTeam) && (
                            <Image
                              src={getTeamLogo(fixture.awayTeam)!}
                              alt={`${fixture.awayTeam} logo`}
                              width={32}
                              height={32}
                              className="rounded-sm"
                            />
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {format(fixture.kickOffTime.toDate(), "EEE, MMM d 'at' HH:mm")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status: {fixture.status} | GW: {fixture.gameweek}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {fixture.fixtureId}
                          </p>
                          {fixture.homeScore !== undefined && fixture.awayScore !== undefined && (
                            <p className="text-lg font-bold text-primary">
                              {fixture.homeScore} - {fixture.awayScore}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 