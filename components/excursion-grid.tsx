"use client"

import { useState } from "react"
import { ExcursionCard } from "@/components/excursion-card"
import { ExcursionDetailPanel } from "@/components/excursion-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import type { ExcursionData } from "@/lib/types/viator"

interface ExcursionGridProps {
  selectedDay: number
  isLoading?: boolean
  loadingProgress?: number
  excursions: ExcursionData[]
}

export function ExcursionGrid({ selectedDay, isLoading, loadingProgress = 0, excursions }: ExcursionGridProps) {
  const [selectedExcursion, setSelectedExcursion] = useState<ExcursionData | null>(null)

  // For now, show all excursions (day filtering will be enhanced later)
  const displayExcursions = excursions

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
          {displayExcursions.length} Excursions Available
        </h2>
        {displayExcursions.map((excursion, index) => (
          <ExcursionCard
            key={excursion.id}
            excursion={excursion}
            onClick={() => setSelectedExcursion(excursion)}
            index={index}
          />
        ))}
        {displayExcursions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No excursions found</p>
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
