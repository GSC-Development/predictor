"use client"

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function DebugAuthPage() {
  const { user, userProfile, loading, error, signUp, signIn, logout } = useAuth();

  const testSignUp = async () => {
    try {
      console.log('🧪 Testing sign up...');
      await signUp('debug@example.com', 'debug123', 'Debug User');
      console.log('✅ Sign up successful');
    } catch (err) {
      console.error('❌ Sign up failed:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Error:</strong> {error || '✅ None'}
              </div>
              <div>
                <strong>User:</strong> {user ? '✅ Exists' : '❌ None'}
              </div>
              <div>
                <strong>Profile:</strong> {userProfile ? '✅ Loaded' : '❌ None'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
            {JSON.stringify({
              user: user ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified
              } : null,
              userProfile,
              loading,
              error
            }, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button onClick={testSignUp} className="w-full">
              🧪 Test Sign Up (debug@example.com)
            </Button>
            
            {user && (
              <Button onClick={logout} variant="destructive" className="w-full">
                🚪 Sign Out
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ <strong>When not signed in:</strong> user = null, should show AuthForm</p>
            <p>✅ <strong>When signed in:</strong> user = object, should show prediction cards</p>
            <p>✅ <strong>Navigation:</strong> should show "Sign In" or user avatar accordingly</p>
          </div>
        </div>
      </div>
    </div>
  );
} 