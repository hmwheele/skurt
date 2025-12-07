"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface RecentSearch {
  destination: string
  dates: string | null
  timestamp: number
}

export function RecentSearches() {
  const router = useRouter()
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    setRecentSearches(searches)
  }, [])

  const handleCardClick = (destination: string, dates: string | null) => {
    const params = new URLSearchParams()
    params.set("destination", destination)
    router.push(`/search?${params.toString()}`)
  }

  // Don't show section if no recent searches
  if (recentSearches.length === 0) {
    return null
  }

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-bold mb-8 text-left pt-16 font-sans text-2xl">Your recent searches</h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {recentSearches.map((search, index) => (
              <CarouselItem
                key={`${search.destination}-${index}`}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <button
                  onClick={() => handleCardClick(search.destination, search.dates)}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 w-full min-h-[300px] px-6 text-left flex flex-col justify-end pb-6"
                >
                  <div className="space-y-2">
                    <div className="text-foreground font-sans text-3xl font-extrabold">{search.destination}</div>
                    {search.dates && (
                      <div className="text-xs text-muted-foreground font-sans">{search.dates}</div>
                    )}
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
