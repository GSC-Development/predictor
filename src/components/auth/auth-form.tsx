"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signUp, signIn, resetPassword, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    if (mode !== 'reset' && !password.trim()) return;
    if (mode === 'signup' && !name.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, name.trim());
      } else if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else if (mode === 'reset') {
        await resetPassword(email.trim());
        setResetEmailSent(true);
      }
      // Success - user will be redirected by auth state change
    } catch (error) {
      console.error('Authentication failed:', error);
      // Error is handled by useAuth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'signin': return 'Sign In';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Join the Predictor League and start making predictions';
      case 'signin': return 'Welcome back! Sign in to your account';
      case 'reset': return 'Enter your email to receive a password reset link';
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      switch (mode) {
        case 'signup': return 'Creating Account...';
        case 'signin': return 'Signing In...';
        case 'reset': return 'Sending Reset Email...';
      }
    }
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'signin': return 'Sign In';
      case 'reset': return 'Send Reset Email';
    }
  };

  if (resetEmailSent) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-6 px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Check Your Email
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-primary text-sm">
              <strong>Check your email inbox</strong> and click the reset link to create a new password.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                setMode('signin');
                setResetEmailSent(false);
                setEmail('');
              }}
              className="w-full"
            >
              Back to Sign In
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                setResetEmailSent(false);
              }}
              className="w-full text-primary hover:text-primary/80"
            >
              Send Another Reset Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center pb-6 px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          {getTitle()}
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          {getSubtitle()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm text-center">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              required
              autoComplete="email"
            />
          </div>

          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'signup' ? "Create a password (min 6 characters)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
                autoComplete={mode === 'signup' ? "new-password" : "current-password"}
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold"
            disabled={isSubmitting || !email.trim() || (mode !== 'reset' && !password.trim()) || (mode === 'signup' && !name.trim())}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                {getButtonText()}
              </div>
            ) : (
              getButtonText()
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t space-y-2">
          {mode === 'signin' && (
            <>
              <Button
                variant="ghost"
                onClick={() => setMode('reset')}
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Button>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setMode('signup');
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-primary hover:text-primary/80"
              >
                Create Account Instead
              </Button>
            </>
          )}
          
          {mode === 'signup' && (
            <>
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setMode('signin');
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-primary hover:text-primary/80"
              >
                Sign In Instead
              </Button>
            </>
          )}
          
          {mode === 'reset' && (
            <>
              <p className="text-sm text-muted-foreground">
                Remember your password?
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setMode('signin');
                  setPassword('');
                }}
                className="text-primary hover:text-primary/80"
              >
                Back to Sign In
              </Button>
            </>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔒 <strong>Your data is secure!</strong> We use Firebase authentication to protect your account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 