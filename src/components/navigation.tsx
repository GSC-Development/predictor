"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Home", icon: "■" },
  { href: "/predictions", label: "Predict", icon: "▲" },
  { href: "/leagues", label: "Leagues", icon: "●" },
  { href: "/leaderboard", label: "Leaders", icon: "▪" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300">
              Predictor
            </h2>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className={`
                      flex items-center gap-2 font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-primary/10 hover:text-primary'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
} 