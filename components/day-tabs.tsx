"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DayTabsProps {
  selectedDay: number
  onDayChange: (day: number) => void
  dayCounts: { day: number; date: string; count: number }[]
  isLoading?: boolean
}

export function DayTabs({ selectedDay, onDayChange, dayCounts, isLoading }: DayTabsProps) {
  const needsCarousel = dayCounts.length > 5
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShowContent(false)
    } else {
      const fadeInTimeout = setTimeout(() => {
        setShowContent(true)
      }, 100)
      return () => clearTimeout(fadeInTimeout)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="flex gap-2">
          {Array.from({ length: Math.min(5, dayCounts.length) }).map((_, i) => (
            <div key={i} className="px-6 py-4 bg-muted/30">
              <Skeleton className="h-5 w-20 mb-2 bg-muted" />
              <Skeleton className="h-3 w-24 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (needsCarousel) {
    return (
      <div className={`px-4 py-2 transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <Carousel className="w-full" opts={{ align: "start", slidesToScroll: 3 }}>
          <CarouselContent className="-ml-0">
            {dayCounts.map(({ day, date, count }) => (
              <CarouselItem key={day} className="pl-0 basis-auto">
                <button
                  onClick={() => onDayChange(day)}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-6 py-4 transition-colors",
                    selectedDay === day ? "border-primary bg-background" : "bg-muted/30 hover:bg-muted/50",
                  )}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="text-lg font-bold">{date}</div>
                    <div className="text-xs text-muted-foreground/60">{count} excursions</div>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    )
  }

  return (
    <div className={`px-4 py-2 transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}>
      <Tabs value={selectedDay.toString()} onValueChange={(val) => onDayChange(Number(val))}>
        <TabsList className="h-auto w-full justify-start rounded-none bg-transparent border-0 p-0">
          {dayCounts.map(({ day, date, count }) => (
            <TabsTrigger
              key={day}
              value={day.toString()}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=inactive]:bg-muted/30 px-6 py-4"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="text-lg font-bold">{date}</div>
                <div className="text-xs text-muted-foreground/60">{count} excursions</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
