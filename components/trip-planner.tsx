"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, MapIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

export function TripPlanner() {
  const [showNewTrip, setShowNewTrip] = useState(false)
  const [tripName, setTripName] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // TODO: Fetch from Supabase
  const trips: any[] = []

  const handleCreateTrip = () => {
    // TODO: Save to Supabase
    console.log("Creating trip:", { tripName, dateRange })
    setShowNewTrip(false)
    setTripName("")
    setDateRange(undefined)
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
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
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
              <Button onClick={handleCreateTrip} disabled={!tripName || !dateRange?.from}>
                Create Trip
              </Button>
              <Button variant="outline" onClick={() => setShowNewTrip(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {trips.map((trip) => (
        <Card key={trip.id} className="p-6">
          <h3 className="text-lg font-semibold">{trip.name}</h3>
          <p className="text-sm text-muted-foreground">
            {trip.startDate} - {trip.endDate}
          </p>
        </Card>
      ))}
    </div>
  )
}
