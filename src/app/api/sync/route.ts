import { NextRequest, NextResponse } from 'next/server'
import { syncService } from '@/services/sync'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'fixtures':
        await syncService.syncUpcomingFixtures()
        return NextResponse.json({ success: true, message: 'Fixtures synced successfully' })
      
      case 'results':
        await syncService.syncFinishedResults()
        return NextResponse.json({ success: true, message: 'Results synced successfully' })
      
      case 'lastmatchday':
        await syncService.syncLastMatchday()
        return NextResponse.json({ success: true, message: 'Final matchday synced successfully' })
      
      case 'teams':
        const teams = await syncService.syncTeams()
        return NextResponse.json({ success: true, message: 'Teams synced successfully', teams })
      
      case 'all':
      default:
        await syncService.syncAll()
        return NextResponse.json({ success: true, message: 'Full sync completed successfully' })
    }
  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Sync API is running',
    endpoints: {
      'POST /api/sync': 'Sync all fixtures and results',
      'POST /api/sync?action=fixtures': 'Sync upcoming fixtures only',
      'POST /api/sync?action=results': 'Sync finished results only',
      'POST /api/sync?action=lastmatchday': 'Sync final matchday (May 15-19, 2024)',
      'POST /api/sync?action=teams': 'Fetch SPL teams with badges'
    }
  })
} 