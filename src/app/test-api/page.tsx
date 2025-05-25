'use client'

import { useState } from 'react'

interface APIResult {
  error?: string;
  [key: string]: unknown;
}

export default function TestAPIPage() {
  const [result, setResult] = useState<APIResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (action: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sync?action=${action}`, {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const testDirectAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://v3.football.api-sports.io/leagues?id=179', {
        headers: {
          'x-apisports-key': 'dbdl3cc8237bd43f4f461560e1d814b9'
        }
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#457b9d] mb-8">API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button 
            onClick={() => testEndpoint('teams')}
            className="bg-[#457b9d] text-white px-4 py-2 rounded mr-4"
            disabled={loading}
          >
            Test Teams
          </button>
          
          <button 
            onClick={() => testEndpoint('lastmatchday')}
            className="bg-[#457b9d] text-white px-4 py-2 rounded mr-4"
            disabled={loading}
          >
            Test Last Matchday
          </button>
          
          <button 
            onClick={() => testEndpoint('fixtures')}
            className="bg-[#457b9d] text-white px-4 py-2 rounded mr-4"
            disabled={loading}
          >
            Test Fixtures
          </button>
          
          <button 
            onClick={testDirectAPI}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Test Direct API
          </button>
        </div>

        {loading && (
          <div className="text-lg">Loading...</div>
        )}

        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 