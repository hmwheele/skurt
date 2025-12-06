"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Clock, MapPin, Users, ExternalLink } from "lucide-react"
import { ProviderIcon } from "@/components/provider-icon"
import { useState } from "react"

interface ExcursionDetailPanelProps {
  excursion: {
    id: string
    title: string
    description: string
    price: number
    rating: number
    reviewCount: number
    duration: string
    provider: string
    thumbnail: string
    category: string
    location?: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExcursionDetailPanel({ excursion, open, onOpenChange }: ExcursionDetailPanelProps) {
  const [isSaved, setIsSaved] = useState(false)

  if (!excursion) return null

  const handleBookNow = () => {
    // TODO: Implement affiliate link redirect
    // For now, just log
    console.log("Booking excursion:", excursion.id, excursion.provider)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="relative">
          {/* Image Header */}
          <div className="relative h-64 w-full">
            <img
              src={excursion.thumbnail}
              alt={excursion.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={isSaved ? "fill-current text-red-500" : ""} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ProviderIcon provider={excursion.provider} className="h-6 w-6" />
                <span className="text-sm text-muted-foreground">{excursion.provider}</span>
                <Badge variant="secondary">{excursion.category}</Badge>
              </div>

              <SheetHeader>
                <SheetTitle className="text-2xl">{excursion.title}</SheetTitle>
              </SheetHeader>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{excursion.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({excursion.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{excursion.duration}</p>
                </div>
              </div>
              {excursion.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{excursion.location}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{excursion.description}</p>
            </div>

            {/* Highlights - Mock data */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Skip-the-line access for a hassle-free experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Expert local guide with extensive knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Small group size for a more intimate experience</span>
                </li>
              </ul>
            </div>

            <Separator />

            {/* Pricing and CTA */}
            <div className="sticky bottom-0 bg-background pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="text-3xl font-bold">${excursion.price}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
                <Button size="lg" onClick={handleBookNow} className="gap-2">
                  Book Now
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => console.log("Add to trip plan:", excursion.id)}
              >
                Add to Trip Plan
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
