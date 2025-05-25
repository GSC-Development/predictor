'use client'

import { useState, useEffect } from 'react'
import { fixturesService } from '@/services/fixtures'
import { resultsService } from '@/services/results'
import type { Fixture } from '@/types'

export default function AdminPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    loadFixtures()
  }, [])

  const loadFixtures = async () => {
    try {
      const upcomingFixtures = await fixturesService.getUpcomingFixtures()
      setFixtures(upcomingFixtures)
    } catch (error) {
      console.error('Error loading fixtures:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResult = async (fixture: Fixture, homeScore: number, awayScore: number) => {
    if (!fixture.id) return
    
    setSubmitting(fixture.id)
    try {
      await resultsService.submitResult({
        fixtureId: fixture.id,
        homeScore,
        awayScore,
        isFinished: true
      })
      
      // Remove fixture from list after result submitted
      setFixtures(prev => prev.filter(f => f.id !== fixture.id))
    } catch (error) {
      console.error('Error submitting result:', error)
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-bold text-[#457b9d]">Loading fixtures...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-[#457b9d] mb-4">
            ■ ADMIN
          </h1>
          <p className="text-xl text-gray-600">
            Enter match results for testing
          </p>
        </div>

        {fixtures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl font-bold text-gray-400 mb-4">▪ No fixtures available</div>
            <p className="text-lg text-gray-500">All results have been entered</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fixtures.map((fixture) => (
              <ResultForm
                key={fixture.id}
                fixture={fixture}
                onSubmit={handleSubmitResult}
                loading={submitting === fixture.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultForm({ 
  fixture, 
  onSubmit, 
  loading 
}: { 
  fixture: Fixture
  onSubmit: (fixture: Fixture, homeScore: number, awayScore: number) => void
  loading: boolean 
}) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(fixture, homeScore, awayScore)
  }

  return (
    <div className="border-4 border-[#457b9d] p-6">
      <div className="mb-6">
        <div className="text-sm font-bold text-[#457b9d] mb-2">
          {fixture.leagueType?.toUpperCase()} • GW{fixture.gameweek}
        </div>
        <div className="text-2xl font-bold text-black">
          {fixture.homeTeam} vs {fixture.awayTeam}
        </div>
        <div className="text-sm text-gray-600">
          {fixture.matchDate.toDate().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-right">
            <div className="text-lg font-bold mb-2">{fixture.homeTeam}</div>
            <input
              type="number"
              min="0"
              max="20"
              value={homeScore}
              onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              className="w-16 h-16 text-2xl font-bold text-center border-2 border-[#457b9d] focus:outline-none focus:ring-2 focus:ring-[#457b9d] focus:ring-opacity-50"
              disabled={loading}
            />
          </div>
          
          <div className="text-center text-2xl font-bold text-[#457b9d]">
            ●
          </div>
          
          <div className="text-left">
            <div className="text-lg font-bold mb-2">{fixture.awayTeam}</div>
            <input
              type="number"
              min="0"
              max="20"
              value={awayScore}
              onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
              className="w-16 h-16 text-2xl font-bold text-center border-2 border-[#457b9d] focus:outline-none focus:ring-2 focus:ring-[#457b9d] focus:ring-opacity-50"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#457b9d] text-white text-lg font-bold py-4 hover:bg-[#3a6a8a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'SUBMITTING...' : 'SUBMIT RESULT ▲'}
        </button>
      </form>
    </div>
  )
} 