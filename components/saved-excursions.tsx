"use client"

import { ExcursionCard } from "@/components/excursion-card"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"

export function SavedExcursions() {
  // TODO: Fetch from Supabase
  const savedExcursions: any[] = []

  if (savedExcursions.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No saved excursions yet</h3>
            <p className="text-muted-foreground">
              Start exploring and save your favorite excursions to access them later
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-0 border rounded-lg">
      {savedExcursions.map((excursion, index) => (
        <ExcursionCard key={excursion.id} excursion={excursion} index={index} />
      ))}
    </div>
  )
}
