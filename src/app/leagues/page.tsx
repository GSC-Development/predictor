import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LeaguesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <main className="container mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Browse Leagues
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            Join or create prediction leagues with friends and colleagues
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-4 text-primary">
                <span className="text-4xl font-bold">●</span>
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-lg text-muted-foreground text-center leading-relaxed">
                This is where you&apos;ll be able to browse and join prediction leagues.
              </p>
              
              <div className="grid gap-4 md:gap-6">
                <h3 className="text-xl font-bold text-primary mb-4">League features:</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-xl font-bold">◯</span>
                    <span className="font-medium">Browse public leagues</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-xl font-bold">◆</span>
                    <span className="font-medium">Create private leagues</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-xl font-bold">◈</span>
                    <span className="font-medium">Join with invite codes</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-xl font-bold">▪</span>
                    <span className="font-medium">View league leaderboards</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 