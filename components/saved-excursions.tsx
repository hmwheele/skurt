"use client"

import { useState, useEffect } from "react"
import { ExcursionCard } from "@/components/excursion-card"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { getSavedExcursions } from "@/lib/saved-excursions"

export function SavedExcursions() {
  const [savedExcursions, setSavedExcursions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSavedExcursions()
  }, [])

  const loadSavedExcursions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSavedExcursions()
      // Extract excursion_data from saved records
      const excursions = data.map((saved) => saved.excursion_data)
      setSavedExcursions(excursions)
    } catch (err: any) {
      console.error('Failed to load saved excursions:', err)
      setError(err.message || 'Failed to load saved excursions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p>Loading saved excursions...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-12">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

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
