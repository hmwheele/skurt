"use client"

import { useState } from "react"
import { ExcursionCard } from "@/components/excursion-card"
import { ExcursionDetailPanel } from "@/components/excursion-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Mock data - will be replaced with API data
const mockExcursions = [
  {
    id: "1",
    title: "Eiffel Tower Skip-the-Line Ticket with Summit Access",
    description: "Bypass the crowds with priority access to Paris's iconic Eiffel Tower",
    price: 89,
    rating: 4.8,
    reviewCount: 1250,
    duration: "2 hours",
    provider: "Viator",
    thumbnail: "/placeholder.svg",
    category: "Sightseeing",
    location: "Paris",
    day: 1,
  },
  {
    id: "2",
    title: "Seine River Dinner Cruise",
    description: "Enjoy a romantic evening cruise along the Seine with gourmet dining",
    price: 125,
    rating: 4.7,
    reviewCount: 890,
    duration: "3 hours",
    provider: "GetYourGuide",
    thumbnail: "/placeholder.svg",
    category: "Food & Drink",
    location: "Paris",
    day: 2,
  },
  {
    id: "3",
    title: "Louvre Museum Guided Tour",
    description: "Expert-led tour of the world's largest art museum",
    price: 65,
    rating: 4.9,
    reviewCount: 2100,
    duration: "3 hours",
    provider: "Viator",
    thumbnail: "/placeholder.svg",
    category: "Culture",
    location: "Paris",
    day: 1,
  },
  // Add more mock data for other days...
]

interface ExcursionGridProps {
  selectedDay: number
  isLoading?: boolean
  loadingProgress?: number
}

export function ExcursionGrid({ selectedDay, isLoading, loadingProgress = 0 }: ExcursionGridProps) {
  const [selectedExcursion, setSelectedExcursion] = useState<typeof mockExcursions[0] | null>(null)

  const filteredExcursions = mockExcursions.filter(exc => exc.day === selectedDay)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Searching for excursions...</h2>
          <Progress value={loadingProgress} className="w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b py-3 px-4">
            <div className="flex gap-4">
              <Skeleton className="w-32 h-24 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-0">
        <h2 className="text-lg font-semibold mb-4">
          {filteredExcursions.length} Excursions Available
        </h2>
        {filteredExcursions.map((excursion, index) => (
          <ExcursionCard
            key={excursion.id}
            excursion={excursion}
            onClick={() => setSelectedExcursion(excursion)}
            index={index}
          />
        ))}
        {filteredExcursions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No excursions found for this day</p>
          </div>
        )}
      </div>

      <ExcursionDetailPanel
        excursion={selectedExcursion}
        open={!!selectedExcursion}
        onOpenChange={(open) => !open && setSelectedExcursion(null)}
      />
    </>
  )
}
