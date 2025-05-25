"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { User } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: "■" },
  { href: "/predictions", label: "Predict", icon: "▲" },
  { href: "/leagues", label: "Leagues", icon: "●" },
  { href: "/leaderboard", label: "Leaders", icon: "▪" },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, userProfile } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only showing auth-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300">
              Predictor
            </h2>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className={`
                      flex items-center gap-1 sm:gap-2 font-medium transition-all duration-300 touch-manipulation
                      min-h-[44px] px-2 sm:px-3
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-primary/10 hover:text-primary active:bg-primary/20'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{item.icon}</span>
                    <span className="hidden xs:inline text-xs sm:text-sm">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            
            {/* Account button */}
            <Link href="/account">
              <Button 
                variant={pathname === "/account" ? "default" : "ghost"} 
                size="sm"
                className={`
                  flex items-center gap-1 sm:gap-2 font-medium transition-all duration-300 touch-manipulation
                  min-h-[44px] px-2 sm:px-3
                  ${pathname === "/account" 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-primary/10 hover:text-primary active:bg-primary/20'
                  }
                `}
              >
                {!mounted ? (
                  // Show neutral state during hydration to prevent mismatch
                  <>
                    <User className="w-4 h-4" />
                    <span className="hidden xs:inline text-xs sm:text-sm">Account</span>
                  </>
                ) : user && userProfile ? (
                  <>
                    {/* Show user avatar/name when signed in */}
                    <div className="w-5 h-5 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center sm:hidden">
                      <span className="text-primary font-bold text-xs">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <User className="w-4 h-4 hidden sm:block" />
                    <span className="hidden xs:inline text-xs sm:text-sm">Account</span>
                  </>
                ) : (
                  <>
                    {/* Show sign in when not signed in */}
                    <User className="w-4 h-4" />
                    <span className="hidden xs:inline text-xs sm:text-sm">Sign In</span>
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 