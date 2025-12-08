import { NextRequest, NextResponse } from 'next/server'
import { ViatorClient } from '@/lib/viator/client'
import { getMockExcursions } from '@/lib/mock-data'
import type { ExcursionData } from '@/lib/types/viator'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destination = searchParams.get('destination')
    const startDate = searchParams.get('from')
    const endDate = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      )
    }

    const results: ExcursionData[] = []
    let apiCallSuccessful = false

    // Viator API
    if (process.env.VIATOR_API_KEY) {
      try {
        const viatorClient = new ViatorClient(process.env.VIATOR_API_KEY)
        const viatorResults = await viatorClient.searchProducts({
          destination,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page,
          limit: 100, // Increased from 20 to 100 for more results
        })
        results.push(...viatorResults)
        apiCallSuccessful = true
        console.log(`✅ Viator API: Found ${viatorResults.length} results for "${destination}"`)
        console.log(`📊 Viator API: Requested limit=100, page=${page}`)

        // Log if we got fewer results than expected
        if (viatorResults.length < 10) {
          console.warn(`⚠️ Viator API returned only ${viatorResults.length} results - this might indicate:`)
          console.warn(`   - Limited availability for destination: ${destination}`)
          console.warn(`   - Date range restrictions`)
          console.warn(`   - API rate limiting`)
        }
      } catch (error) {
        console.error('❌ Viator API error:', error)
        // Return error response instead of falling back to mock data
        return NextResponse.json(
          {
            error: 'Viator API error',
            details: error instanceof Error ? error.message : 'Unknown error',
            excursions: [],
            total: 0,
            page,
            usingMockData: false
          },
          { status: 200 } // Return 200 with empty results instead of error
        )
      }
    } else {
      console.error('❌ VIATOR_API_KEY not configured')
      return NextResponse.json(
        {
          error: 'Viator API key not configured',
          excursions: [],
          total: 0,
          page,
          usingMockData: false
        },
        { status: 200 }
      )
    }

    // TODO: Add GetYourGuide API when approved
    // if (process.env.GETYOURGUIDE_API_KEY) {
    //   const gygResults = await getYourGuideClient.search(...)
    //   results.push(...gygResults)
    //   apiCallSuccessful = true
    // }

    // No mock data fallback - only show real API results

    // Sort by rating (descending) then by price (ascending)
    results.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      return a.price - b.price
    })

    return NextResponse.json({
      excursions: results,
      total: results.length,
      page,
      usingMockData: !apiCallSuccessful,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search excursions' },
      { status: 500 }
    )
  }
}
