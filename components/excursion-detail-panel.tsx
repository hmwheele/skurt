"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Heart, Clock, MapPin, Calendar, Users, CheckCircle2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderIcon } from "@/components/provider-icon"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"
import { saveExcursion, unsaveExcursion, isExcursionSaved } from "@/lib/saved-excursions"

interface ExcursionPanelProps {
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
    location: string
    category: string
    images?: string[]
    affiliateLink: string
  } | null
  open: boolean
  onClose: () => void
}

const mockHighlights = [
  "Skip-the-line priority access",
  "Expert local guide included",
  "Small group size (max 12 people)",
  "Hotel pickup and drop-off",
  "Free cancellation up to 24 hours",
]

const mockReviews = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    date: "Dec 2024",
    comment: "Absolutely amazing experience! Our guide was knowledgeable and friendly.",
  },
  {
    id: "2",
    author: "John D.",
    rating: 5,
    date: "Nov 2024",
    comment: "Worth every penny. The views were breathtaking and well organized.",
  },
  {
    id: "3",
    author: "Emma L.",
    rating: 4,
    date: "Nov 2024",
    comment: "Great tour overall. Only wish we had more time at each location.",
  },
]

export function ExcursionPanel({ excursion, open, onClose }: ExcursionPanelProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { user } = useAuth()

  // Reset image loaded state when switching images
  useEffect(() => {
    setImageLoaded(false)
  }, [currentImage])

  // Reset carousel to first image when panel opens
  useEffect(() => {
    if (open) {
      setCurrentImage(0)
      setImageLoaded(false)
      setMapLoaded(false)
    }
  }, [open])

  // Check if excursion is saved when panel opens or user changes
  useEffect(() => {
    if (open && excursion && user) {
      isExcursionSaved(excursion.id).then(setIsSaved)
    } else if (!user) {
      setIsSaved(false)
    }
  }, [open, excursion, user])

  if (!excursion) return null

  // Use excursion images if available, otherwise use thumbnail as fallback
  const displayImages = excursion.images && excursion.images.length > 0
    ? excursion.images
    : [excursion.thumbnail]

  // Calculate zoom level based on location specificity
  const getZoomLevel = (location: string) => {
    if (!location) return 11
    // If location contains numbers, it's likely an address - zoom closer
    if (/\d/.test(location)) return 15
    // If location has multiple parts (e.g., "Street, District, City"), use medium zoom
    const parts = location.split(',').map(p => p.trim())
    if (parts.length > 2) return 13
    // Just city and country - wider zoom
    return 11
  }

  const zoomLevel = getZoomLevel(excursion.location || '')

  // Get Mapbox token with proper fallback for client-side rendering
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    try {
      if (isSaved) {
        await unsaveExcursion(excursion.id)
        setIsSaved(false)
      } else {
        await saveExcursion(excursion.id, excursion)
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Failed to save excursion:', error)
    }
  }

  const handleAuthSuccess = async () => {
    setShowAuthModal(false)
    // Save after successful auth
    try {
      await saveExcursion(excursion.id, excursion)
      setIsSaved(true)
    } catch (error) {
      console.error('Failed to save excursion:', error)
    }
  }

  const handleAddToTrip = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    // Navigate to trips page
    window.location.href = "/trips"
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {/* Image carousel */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={displayImages[currentImage]}
                alt={excursion.title}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {displayImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        i === currentImage ? "bg-white w-8" : "bg-white/60",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <SheetHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ProviderIcon provider={excursion.provider} className="h-6 w-6" />
                      <span className="text-sm font-medium text-muted-foreground">{excursion.provider}</span>
                    </div>
                    <SheetTitle className="text-2xl text-balance">{excursion.title}</SheetTitle>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">{excursion.rating}</span>
                        <span>({excursion.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{excursion.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={cn(isSaved && "text-destructive")}
                  >
                    <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                  </Button>
                </div>
              </SheetHeader>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{excursion.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Group Size</p>
                    <p className="text-sm text-muted-foreground">Small group</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About this experience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {excursion.description}. Experience the best of what this destination has to offer with our carefully
                  curated excursion. Our expert guides will ensure you have an unforgettable journey filled with amazing
                  sights and memorable moments.
                </p>
              </div>

              <Separator />

              {/* Highlights */}
              <div>
                <h3 className="text-lg font-semibold mb-3">What's included</h3>
                <ul className="space-y-2">
                  {mockHighlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Location map */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${encodeURIComponent(excursion.location || 'Paris, France')})/${encodeURIComponent(excursion.location || 'Paris, France')},${zoomLevel},0/800x450@2x?access_token=${mapboxToken}`}
                    alt={`Map of ${excursion.location}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-500",
                      mapLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setMapLoaded(true)}
                    onError={(e) => {
                      console.error('Map failed to load')
                      setMapLoaded(true)
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{excursion.location}</span>
                </div>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Reviews</h3>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing and CTAs */}
              <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-6 -mx-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">From </span>
                    <span className="text-3xl font-bold">${excursion.price}</span>
                    <span className="text-sm text-muted-foreground"> /person</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    asChild
                  >
                    <a href={excursion.affiliateLink} target="_blank" rel="noopener noreferrer">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleAddToTrip}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add to Trip
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onSuccess={handleAuthSuccess} />
    </>
  )
}
