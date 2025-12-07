"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { SearchModifier } from "@/components/search-modifier"
import { Filterssidebar } from "@/components/filters-sidebar"
import { ExcursionGrid } from "@/components/excursion-grid"
import { DayTabs } from "@/components/day-tabs"
import { differenceInDays, addDays, format } from "date-fns"
import type { ExcursionData } from "@/lib/types/viator"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [selectedDay, setSelectedDay] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [excursions, setExcursions] = useState<ExcursionData[]>([])
  const [usingMockData, setUsingMockData] = useState(false)

  // Filter state
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)

  const destination = searchParams.get("destination") || "Destination"
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")

  // Fetch excursions from API
  useEffect(() => {
    const fetchExcursions = async () => {
      setIsLoading(true)
      setLoadingProgress(0)

      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      try {
        const params = new URLSearchParams({
          destination,
        })
        if (fromDate) params.set('from', fromDate)
        if (toDate) params.set('to', toDate)

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()

        setExcursions(data.excursions || [])
        setUsingMockData(data.usingMockData || false)
        setLoadingProgress(100)
      } catch (error) {
        console.error('Failed to fetch excursions:', error)
        setExcursions([])
      } finally {
        clearInterval(progressInterval)
        setTimeout(() => setIsLoading(false), 300)
      }
    }

    fetchExcursions()
  }, [destination, fromDate, toDate])

  // Apply filters to excursions
  const filteredExcursions = useMemo(() => {
    return excursions.filter(excursion => {
      // Price filter
      if (excursion.price < priceRange[0] || excursion.price > priceRange[1]) {
        return false
      }

      // Activity type filter
      if (selectedActivities.length > 0 && !selectedActivities.includes(excursion.category)) {
        return false
      }

      // Duration filter
      if (selectedDurations.length > 0) {
        const durationMatch = selectedDurations.some(dur => {
          const hours = parseFloat(excursion.duration)
          if (dur === 'short' && hours < 2) return true
          if (dur === 'medium' && hours >= 2 && hours < 4) return true
          if (dur === 'long' && hours >= 4 && hours < 8) return true
          if (dur === 'full' && hours >= 8) return true
          return false
        })
        if (!durationMatch) return false
      }

      // Rating filter
      if (minRating > 0 && excursion.rating < minRating) {
        return false
      }

      return true
    })
  }, [excursions, priceRange, selectedActivities, selectedDurations, minRating])

  const dayCounts = useMemo(() => {
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    let startDate = new Date()
    let endDate = new Date()
    let numberOfDays = 5 // default to 5 days if no dates provided

    if (fromParam && toParam) {
      startDate = new Date(fromParam)
      endDate = new Date(toParam)
      numberOfDays = differenceInDays(endDate, startDate) + 1 // +1 to include both start and end dates
    } else {
      // If no dates provided, use today as start and add 5 days
      endDate = addDays(startDate, numberOfDays - 1)
    }

    // Generate tabs for each day in the range using filtered excursions
    return Array.from({ length: numberOfDays }, (_, i) => {
      const date = addDays(startDate, i)
      const dateStr = format(date, "MMM d")
      const dayNumber = i + 1

      // Calculate actual count for this day using filtered excursions
      const count = filteredExcursions.filter(excursion => excursion.day === dayNumber || !excursion.day).length

      return {
        day: dayNumber,
        date: dateStr,
        count: count,
      }
    })
  }, [searchParams, filteredExcursions])

  return (
    <div className="min-h-screen">
      <Header />
      <SearchModifier
        initialDestination={destination}
        initialFromDate={fromDate || undefined}
        initialToDate={toDate || undefined}
      />
      <main className="relative">
        <div className="fixed left-0 top-[146px] bottom-0 w-[320px] z-10">
          <Filterssidebar
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedActivities={selectedActivities}
            onActivitiesChange={setSelectedActivities}
            selectedDurations={selectedDurations}
            onDurationsChange={setSelectedDurations}
            minRating={minRating}
            onMinRatingChange={setMinRating}
          />
        </div>
        <div className="ml-[320px]">
          <div className="sticky top-[146px] z-20 bg-background">
            <div className="px-4 pt-6 pb-2">
              <h1 className="text-3xl font-bold font-sans">{destination}</h1>
              {usingMockData && !isLoading && (
                <p className="text-sm text-muted-foreground mt-1">
                  📦 Using demo data (Viator API will work in production)
                </p>
              )}
            </div>
            <DayTabs
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              dayCounts={dayCounts}
              isLoading={isLoading}
            />
          </div>
          <div className="px-4 py-8">
            <ExcursionGrid
              selectedDay={selectedDay}
              isLoading={isLoading}
              loadingProgress={loadingProgress}
              excursions={filteredExcursions}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
