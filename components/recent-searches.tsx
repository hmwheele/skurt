"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const popularDestinations = [
  { name: "Paris", country: "France", image: "/placeholder.svg" },
  { name: "Tokyo", country: "Japan", image: "/placeholder.svg" },
  { name: "New York", country: "USA", image: "/placeholder.svg" },
  { name: "Barcelona", country: "Spain", image: "/placeholder.svg" },
  { name: "Dubai", country: "UAE", image: "/placeholder.svg" },
  { name: "Rome", country: "Italy", image: "/placeholder.svg" },
]

export function RecentSearches() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/search?destination=${encodeURIComponent(dest.name)}`}
            >
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
          ))}
        </div>
      </div>
    </section>
  )
}
