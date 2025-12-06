"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Filterssidebar } from "@/components/filters-sidebar"
import { ExcursionGrid } from "@/components/excursion-grid"
import { DayTabs } from "@/components/day-tabs"
import { differenceInDays, addDays, format } from "date-fns"

function hashDate(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [selectedDay, setSelectedDay] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const destination = searchParams.get("destination") || "Destination"

  useEffect(() => {
    setIsLoading(true)
    setLoadingProgress(0)

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2 // Increment by 2 every 100ms to reach 100 in 5 seconds
      })
    }, 100)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

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

    // Generate tabs for each day in the range
    return Array.from({ length: numberOfDays }, (_, i) => {
      const date = addDays(startDate, i)
      const dateStr = format(date, "MMM d")
      const dayNumber = i + 1

      // Import mock data to get actual counts
      const mockExcursions = [
        { id: "1", day: 1 },
        { id: "2", day: 2 },
        { id: "3", day: 1 },
        { id: "4", day: 3 },
        { id: "5", day: 2 },
        { id: "6", day: 4 },
        { id: "7", day: 1 },
        { id: "8", day: 5 },
        { id: "9", day: 3 },
        { id: "10", day: 4 },
        { id: "11", day: 5 },
        { id: "12", day: 2 },
      ]

      const count = mockExcursions.filter((exc) => exc.day === dayNumber).length

      return {
        day: dayNumber,
        date: dateStr,
        count: count,
      }
    })
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <div className="fixed left-0 top-[73px] bottom-0 w-[320px] z-10">
          <Filterssidebar />
        </div>
        <div className="ml-[320px]">
          <div className="sticky top-[73px] z-20 bg-background">
            <div className="px-4 pt-6 pb-2">
              <h1 className="text-3xl font-bold font-sans">{destination}</h1>
            </div>
            <DayTabs
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              dayCounts={dayCounts}
              isLoading={isLoading}
            />
          </div>
          <div className="px-4 py-8">
            <ExcursionGrid selectedDay={selectedDay} isLoading={isLoading} loadingProgress={loadingProgress} />
          </div>
        </div>
      </main>
    </div>
  )
}
