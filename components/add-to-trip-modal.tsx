"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Plus, Calendar, CalendarIcon } from "lucide-react"
import { getUserTrips, createTrip, addExcursionToTrip, type Trip } from "@/lib/trips"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface AddToTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  excursion: any
  onSuccess?: () => void
}

export function AddToTripModal({ open, onOpenChange, excursion, onSuccess }: AddToTripModalProps) {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // New trip form
  const [tripName, setTripName] = useState("")
  const [destination, setDestination] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    if (open) {
      loadTrips()
      setError(null)
      setSuccessMessage(null)

      // Auto-fill destination from excursion location
      if (excursion) {
        const location = excursion.location?.name || excursion.destination?.name || excursion.location || ''
        if (location) {
          setDestination(location)
        }
      }

      // Auto-fill dates from search params
      const fromDate = searchParams.get('from')
      const toDate = searchParams.get('to')
      if (fromDate && toDate) {
        setDateRange({
          from: new Date(fromDate),
          to: new Date(toDate),
        })
      }
    }
  }, [open, excursion, searchParams])

  const loadTrips = async () => {
    try {
      const userTrips = await getUserTrips()
      setTrips(userTrips)
    } catch (err) {
      console.error('Failed to load trips:', err)
    }
  }

  const handleAddToExistingTrip = async (tripId: string) => {
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await addExcursionToTrip(tripId, excursion.id, excursion)
      setSuccessMessage("Added to trip!")
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to add to trip")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dateRange?.from || !dateRange?.to) {
      setError("Please select start and end dates")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const newTrip = await createTrip({
        name: tripName,
        destination,
        start_date: format(dateRange.from, 'yyyy-MM-dd'),
        end_date: format(dateRange.to, 'yyyy-MM-dd'),
      })

      await addExcursionToTrip(newTrip.id, excursion.id, excursion)

      setSuccessMessage("Trip created and excursion added!")
      setTripName("")
      setDestination("")
      setDateRange(undefined)

      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to create trip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>
            Add "{excursion?.title}" to an existing trip or create a new one
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Trip</TabsTrigger>
            <TabsTrigger value="new">New Trip</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {trips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No trips yet. Create your first trip!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {trips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => handleAddToExistingTrip(trip.id)}
                    disabled={loading}
                    className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">{trip.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {trip.destination} • {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trip-name">Trip Name</Label>
                <Input
                  id="trip-name"
                  placeholder="Summer Vacation 2025"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination (optional)</Label>
                <Input
                  id="destination"
                  placeholder="Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={loading}
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
                        <span>Select dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !tripName || !dateRange?.from || !dateRange?.to}>
                <Plus className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Create Trip & Add"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
