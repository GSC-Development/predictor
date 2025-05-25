"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    if (isNavigating) return
    setIsNavigating(true)
    router.push(path)
    // Reset after navigation (failsafe)
    setTimeout(() => setIsNavigating(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Predictor
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Predict exact scores across multiple leagues
          </p>
        </div>
        
        {/* Action Cards */}
        <div className="grid gap-8 md:gap-12 max-w-5xl mx-auto">
          
          {/* Primary Action */}
          <Card className="group relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-4">
                <span className="text-3xl font-bold">▲</span>
                Make Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                Predict exact scores for football matches across different leagues
              </p>
              <Button 
                size="lg"
                variant="secondary" 
                className="w-full text-lg py-6 font-semibold hover:bg-secondary/90 transition-all duration-300"
                onClick={() => handleNavigation("/predictions")}
                disabled={isNavigating}
              >
                {isNavigating ? "Loading..." : "Start Predicting"}
              </Button>
            </CardContent>
          </Card>

          {/* Secondary Actions */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="group border-2 border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-primary">
                  <span className="text-2xl font-bold">●</span>
                  Join Leagues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Create private leagues or join public competitions
                </p>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => handleNavigation("/leagues")}
                  disabled={isNavigating}
                >
                  Browse Leagues
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group border-2 border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-primary">
                  <span className="text-2xl font-bold">▪</span>
                  Global Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  See who&apos;s leading across all leagues and competitions
                </p>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => handleNavigation("/leaderboard")}
                  disabled={isNavigating}
                >
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading Overlay */}
        {isNavigating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-lg shadow-2xl border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
