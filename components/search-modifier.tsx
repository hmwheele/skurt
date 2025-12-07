"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { searchDestinations } from "@/lib/destinations"

interface SearchModifierProps {
  initialDestination: string
  initialFromDate?: string
  initialToDate?: string
}

export function SearchModifier({ initialDestination, initialFromDate, initialToDate }: SearchModifierProps) {
  const router = useRouter()
  const [destination, setDestination] = useState(initialDestination)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (initialFromDate && initialToDate) {
      return {
        from: new Date(initialFromDate),
        to: new Date(initialToDate),
      }
    }
    if (initialFromDate) {
      return {
        from: new Date(initialFromDate),
        to: undefined,
      }
    }
    return undefined
  })

  const filteredDestinations = searchDestinations(destination, 10)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set("destination", destination)
    if (dateRange?.from) params.set("from", dateRange.from.toISOString())
    if (dateRange?.to) params.set("to", dateRange.to.toISOString())
    router.push(`/search?${params.toString()}`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="border-b bg-muted/30 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch max-w-4xl mx-auto">
          {/* Destination autocomplete */}
          <div className="relative flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 h-10 bg-background"
              />
            </div>
            {showSuggestions && destination && filteredDestinations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
                    onClick={() => {
                      setDestination(dest)
                      setShowSuggestions(false)
                    }}
                  >
                    <MapPin className="inline h-3 w-3 mr-2 text-muted-foreground" />
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal md:min-w-[260px] bg-background",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Select dates</span>
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
                disabled={(date) => date < today}
              />
            </PopoverContent>
          </Popover>

          {/* Search button */}
          <Button onClick={handleSearch} size="sm" className="h-10 px-4">
            <Search className="mr-1 h-4 w-4" />
            Update
          </Button>
        </div>
      </div>
    </div>
  )
}
