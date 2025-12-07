"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const popularDestinations = [
  { name: "Paris", country: "France", image: "/eiffel-tower-paris.png" },
  { name: "Tokyo", country: "Japan", image: "/tokyo-skyline-night.png" },
  { name: "New York", country: "USA", image: "/nyc-skyline.png" },
  { name: "Barcelona", country: "Spain", image: "/sagrada-familia-barcelona.png" },
  { name: "Dubai", country: "UAE", image: "/dubai-desert-safari-dunes.jpg" },
  { name: "Bali", country: "Indonesia", image: "/bali-temple.jpg" },
]

export function RecentSearches() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {popularDestinations.map((dest) => (
              <CarouselItem key={dest.name} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6">
                <Link href={`/search?destination=${encodeURIComponent(dest.name)}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square relative">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="font-semibold">{dest.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{dest.country}</p>
                    </div>
                  </Card>
                </Link>
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
