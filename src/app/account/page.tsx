"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Calendar, Mail, User, LogOut, Shield } from 'lucide-react';

export default function AccountPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect immediately, let them see they need to sign in
      setTimeout(() => {
        router.push('/predictions');
      }, 3000);
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/predictions');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading account...</span>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Account Required</h1>
            <p className="text-lg text-muted-foreground mb-8">
              You need to sign in to view your account page.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-primary/20">
              <p className="text-muted-foreground mb-4">
                Redirecting to sign in page in a few seconds...
              </p>
              <Button 
                onClick={() => router.push('/predictions')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Go to Sign In Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const joinedDate = userProfile.joinedAt?.toDate?.()?.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) || 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Account Management</h1>
          <p className="text-muted-foreground text-lg">
            Manage your predictor account and view your stats
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Overview */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{userProfile.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Your Statistics
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <Trophy className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="font-bold text-2xl text-primary">{userProfile.totalPoints}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Week Points</p>
                        <p className="font-bold text-xl text-secondary">{userProfile.currentWeekPoints}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Active Member
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/predictions')}
                  className="h-12 text-left justify-start"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  View Predictions
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/leaderboard')}
                  className="h-12 text-left justify-start"
                >
                  <Trophy className="w-5 h-5 mr-3" />
                  View Leaderboard
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleSignOut}
                  className="w-full sm:w-auto h-12"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Shield className="w-6 h-6 text-accent" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Your account is secured with Firebase Authentication
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  We only store necessary data for the prediction game
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Your email is used only for authentication
                </p>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
} 