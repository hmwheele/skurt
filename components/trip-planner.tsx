"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, MapIcon, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { getUserTrips, createTrip, deleteTrip, getTripExcursions, type Trip, type TripExcursion } from "@/lib/trips"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExcursionCard } from "@/components/excursion-card"

export function TripPlanner() {
  const [showNewTrip, setShowNewTrip] = useState(false)
  const [tripName, setTripName] = useState("")
  const [destination, setDestination] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [expandedTrips, setExpandedTrips] = useState<Set<string>>(new Set())
  const [tripExcursions, setTripExcursions] = useState<Record<string, TripExcursion[]>>({})

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const userTrips = await getUserTrips()
      setTrips(userTrips)
    } catch (err: any) {
      console.error('Failed to load trips:', err)
      setError(err.message || 'Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async () => {
    if (!tripName || !dateRange?.from || !dateRange?.to) return

    setCreating(true)
    setError(null)

    try {
      await createTrip({
        name: tripName,
        destination: destination || undefined,
        start_date: format(dateRange.from, 'yyyy-MM-dd'),
        end_date: format(dateRange.to, 'yyyy-MM-dd'),
      })

      setShowNewTrip(false)
      setTripName("")
      setDestination("")
      setDateRange(undefined)
      await loadTrips()
    } catch (err: any) {
      console.error('Failed to create trip:', err)
      setError(err.message || 'Failed to create trip')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      await deleteTrip(tripId)
      await loadTrips()
    } catch (err: any) {
      console.error('Failed to delete trip:', err)
      setError(err.message || 'Failed to delete trip')
    }
  }

  const toggleTripExpanded = async (tripId: string) => {
    const newExpanded = new Set(expandedTrips)
    if (newExpanded.has(tripId)) {
      newExpanded.delete(tripId)
    } else {
      newExpanded.add(tripId)
      // Load excursions if not already loaded
      if (!tripExcursions[tripId]) {
        try {
          const excursions = await getTripExcursions(tripId)
          setTripExcursions(prev => ({ ...prev, [tripId]: excursions }))
        } catch (err) {
          console.error('Failed to load trip excursions:', err)
        }
      }
    }
    setExpandedTrips(newExpanded)
  }

  if (loading) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p>Loading trips...</p>
        </div>
      </Card>
    )
  }

  if (trips.length === 0 && !showNewTrip) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <MapIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No trip plans yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first trip plan to organize excursions across multiple days
            </p>
            <Button onClick={() => setShowNewTrip(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Trip Plan
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!showNewTrip && (
        <Button onClick={() => setShowNewTrip(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Trip Plan
        </Button>
      )}

      {showNewTrip && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Trip Plan</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trip-name">Trip Name</Label>
              <Input
                id="trip-name"
                placeholder="e.g., Paris Adventure"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination (optional)</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={creating}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateTrip}
                disabled={!tripName || !dateRange?.from || !dateRange?.to || creating}
              >
                {creating ? "Creating..." : "Create Trip"}
              </Button>
              <Button variant="outline" onClick={() => setShowNewTrip(false)} disabled={creating}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {trips.map((trip) => {
        const isExpanded = expandedTrips.has(trip.id)
        const excursions = tripExcursions[trip.id] || []

        return (
          <Card key={trip.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{trip.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {trip.destination}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {excursions.length} {excursions.length === 1 ? 'excursion' : 'excursions'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTripExpanded(trip.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t">
                {excursions.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <p>No excursions added yet</p>
                    <p className="text-sm mt-2">Browse excursions and add them to this trip</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {excursions.map((tripExcursion, index) => (
                      <div key={tripExcursion.id} className="p-4">
                        <ExcursionCard
                          excursion={tripExcursion.excursion_data}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
