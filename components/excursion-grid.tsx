"use client"

import { useState, useEffect } from "react"
import { ExcursionCard } from "@/components/excursion-card"
import { ExcursionDetailPanel as ExcursionPanel } from "@/components/excursion-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import type { ExcursionData } from "@/lib/types/viator"

interface ExcursionGridProps {
  selectedDay: number
  isLoading?: boolean
  loadingProgress?: number
  excursions: ExcursionData[]
}

export function ExcursionGrid({ selectedDay, isLoading = false, loadingProgress = 0, excursions }: ExcursionGridProps) {
  const [selectedExcursion, setSelectedExcursion] = useState<ExcursionData | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  const filteredExcursions = excursions

  useEffect(() => {
    if (isLoading) {
      setRevealedCount(0)
      const revealInterval = setInterval(() => {
        setRevealedCount((prev) => {
          if (prev >= 8) {
            clearInterval(revealInterval)
            return 8
          }
          return prev + 1
        })
      }, 600)

      return () => clearInterval(revealInterval)
    } else {
      setRevealedCount(8)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Searching excursions...</h2>
          <Progress value={loadingProgress} className="h-2" />
        </div>

        <div className="border rounded-lg divide-y">
          {Array.from({ length: revealedCount }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Skeleton className="h-24 w-32 rounded-md flex-shrink-0 bg-muted" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
                <Skeleton className="h-4 w-1/3 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <div className="mb-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold">Day {selectedDay} Excursions</h2>
          <p className="text-muted-foreground mt-1">{filteredExcursions.length} experiences found</p>
        </div>

        <div className="border rounded-lg divide-y bg-card">
          {filteredExcursions.map((excursion, index) => (
            <ExcursionCard
              key={excursion.id}
              excursion={excursion}
              onClick={() => setSelectedExcursion(excursion)}
              index={index}
            />
          ))}
        </div>

        {filteredExcursions.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-muted-foreground text-lg">
              No excursions found for this day. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      <ExcursionPanel
        excursion={selectedExcursion}
        open={!!selectedExcursion}
        onOpenChange={(open) => !open && setSelectedExcursion(null)}
      />
    </>
  )
}
