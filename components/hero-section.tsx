"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, MapPin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

const destinations = [
  "Paris, France",
  "Tokyo, Japan",
  "New York, USA",
  "Bali, Indonesia",
  "Barcelona, Spain",
  "Dubai, UAE",
  "Rome, Italy",
  "Iceland",
]

export function HeroSection() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const filteredDestinations = destinations.filter((d) => d.toLowerCase().includes(destination.toLowerCase()))

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
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-background to-muted">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl text-balance text-foreground font-extrabold">
            Discover and Build Your Next Adventure{" "}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Explore thousands of curated excursions and experiences worldwide
          </p>

          {/* Search form */}
          <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              {/* Destination autocomplete */}
              <div className="relative flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10 h-12 placeholder:text-foreground bg-white"
                  />
                </div>
                {showSuggestions && destination && filteredDestinations.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                    {filteredDestinations.map((dest) => (
                      <button
                        key={dest}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                        onClick={() => {
                          setDestination(dest)
                          setShowSuggestions(false)
                        }}
                      >
                        <MapPin className="inline h-4 w-4 mr-2 text-muted-foreground" />
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
                      "h-12 justify-start text-left font-normal md:min-w-[280px] hover:bg-muted hover:text-foreground bg-white",
                      !dateRange && "text-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, y")}
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
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < today}
                    modifiers={{
                      today: !dateRange?.from ? today : undefined,
                    }}
                    modifiersClassNames={{
                      today: "bg-orange-500 text-white hover:bg-orange-600 hover:text-white",
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Search button */}
              <Button onClick={handleSearch} size="lg" className="h-12 px-6 md:w-auto font-sans font-bold">
                <Search className="mr-1 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
