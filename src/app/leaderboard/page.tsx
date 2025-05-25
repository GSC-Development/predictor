"use client"

import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            See who&apos;s dominating the prediction game across all leagues
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Leaderboard 
            title="Global Rankings"
            maxEntries={100}
          />
        </div>
      </main>
    </div>
  )
} 