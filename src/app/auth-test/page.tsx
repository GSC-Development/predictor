"use client"

import { useAuth } from '@/hooks/useAuth';

export default function AuthTestPage() {
  const { user, userProfile, loading, error, signUp, signIn, logout } = useAuth();

  const handleTestSignUp = async () => {
    try {
      await signUp('test@example.com', 'test123', 'Test User');
      alert('Account created successfully!');
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed: ' + (error as Error).message);
    }
  };

  const handleTestSignIn = async () => {
    try {
      await signIn('test@example.com', 'test123');
      alert('Signed in successfully!');
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email || 'Anonymous' : 'None'}</p>
            <p><strong>User Profile:</strong> {userProfile ? userProfile.name : 'None'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={handleTestSignUp}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Sign Up (test@example.com)
            </button>
            
            <button 
              onClick={handleTestSignIn}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              Test Sign In (test@example.com)
            </button>
            
            {user && (
              <button 
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({
              user: user ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
              } : null,
              userProfile,
              loading,
              error
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 