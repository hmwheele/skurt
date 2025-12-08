"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star, Heart, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderIcon } from "@/components/provider-icon"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"
import { saveExcursion, unsaveExcursion, isExcursionSaved } from "@/lib/saved-excursions"

interface ExcursionCardProps {
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
  }
  onClick?: () => void
  index?: number
}

export function ExcursionCard({ excursion, onClick, index = 0 }: ExcursionCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Check if excursion is saved when user changes or component mounts
  useEffect(() => {
    if (user) {
      isExcursionSaved(excursion.id).then(setIsSaved)
    } else {
      setIsSaved(false)
    }
  }, [user, excursion.id])

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
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
    } finally {
      setLoading(false)
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

  return (
    <>
      <div
        className="group cursor-pointer hover:bg-muted/20 transition-colors border-b py-3 px-4 rounded-none animate-in fade-in duration-500"
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={onClick}
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div className="relative w-32 h-24 overflow-hidden bg-muted">
              <img
                src={excursion.thumbnail || "/placeholder.svg"}
                alt={excursion.title}
                className={cn(
                  "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            <div className="flex items-center gap-2">
              <ProviderIcon provider={excursion.provider} className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{excursion.provider}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base line-clamp-1">{excursion.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 flex-shrink-0", isSaved && "text-destructive")}
                  onClick={handleSave}
                >
                  <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                  <span className="sr-only">Save excursion</span>
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {excursion.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{excursion.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{excursion.duration}</span>
                </div>
                <div className="inline-flex items-center rounded-md px-2 py-0.5 text-xs bg-background">
                  {excursion.category}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{excursion.rating}</span>
                <span className="text-xs text-muted-foreground">({excursion.reviewCount})</span>
              </div>
              <div className="text-sm text-right">
                <span className="font-semibold text-lg">${excursion.price}</span>
                <span className="text-muted-foreground text-xs"> /person</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onSuccess={handleAuthSuccess} />
    </>
  )
}
