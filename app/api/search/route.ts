import { NextRequest, NextResponse } from 'next/server'
import { ViatorClient } from '@/lib/viator/client'
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

    // Viator API
    if (process.env.VIATOR_API_KEY) {
      try {
        const viatorClient = new ViatorClient(process.env.VIATOR_API_KEY)
        const viatorResults = await viatorClient.searchProducts({
          destination,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page,
          limit: 20,
        })
        results.push(...viatorResults)
      } catch (error) {
        console.error('Viator API error:', error)
        // Continue with other providers even if Viator fails
      }
    }

    // TODO: Add GetYourGuide API when approved
    // if (process.env.GETYOURGUIDE_API_KEY) {
    //   const gygResults = await getYourGuideClient.search(...)
    //   results.push(...gygResults)
    // }

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
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search excursions' },
      { status: 500 }
    )
  }
}
