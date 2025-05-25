"use client"

import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

export function UserHeader() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  if (!user || !userProfile) return null;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-lg">
              {userProfile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userProfile.name}</h2>
            <p className="text-sm text-muted-foreground">
              {userProfile.totalPoints} points • Rank #{userProfile.rank || '?'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/account')}
            className="text-sm"
          >
            <Settings className="w-4 h-4 mr-1" />
            Account
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="text-sm"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
} 