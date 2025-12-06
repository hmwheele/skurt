"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

export function HeroSection() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<DateRange | undefined>()

  const handleSearch = () => {
    if (!destination) return

    const params = new URLSearchParams({
      destination,
    })

    if (date?.from) {
      params.set("from", format(date.from, "yyyy-MM-dd"))
    }
    if (date?.to) {
      params.set("to", format(date.to, "yyyy-MM-dd"))
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing Excursions
          </h1>
          <p className="text-xl text-muted-foreground">
            Compare and book the best travel experiences from top providers
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
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
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleSearch} size="lg" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
