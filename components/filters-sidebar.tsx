"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const activityTypes = [
  "Adventure",
  "Culture",
  "Food & Drink",
  "Nature",
  "Water Activities",
  "Sightseeing",
  "Entertainment",
  "Sports"
]

const durations = [
  { id: "short", label: "< 2 hours" },
  { id: "medium", label: "2-4 hours" },
  { id: "long", label: "4-8 hours" },
  { id: "full", label: "Full day" },
  { id: "multi", label: "Multi-day" },
]

export function Filterssidebar() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])

  return (
    <ScrollArea className="h-full border-r bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Price Range</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ${priceRange[0]} - ${priceRange[1]}
            </p>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Activity Type */}
        <div className="space-y-3">
          <h3 className="font-medium">Activity Type</h3>
          {activityTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedActivities.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedActivities([...selectedActivities, type])
                  } else {
                    setSelectedActivities(selectedActivities.filter(t => t !== type))
                  }
                }}
              />
              <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Duration */}
        <div className="space-y-3">
          <h3 className="font-medium">Duration</h3>
          {durations.map((duration) => (
            <div key={duration.id} className="flex items-center space-x-2">
              <Checkbox
                id={duration.id}
                checked={selectedDurations.includes(duration.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedDurations([...selectedDurations, duration.id])
                  } else {
                    setSelectedDurations(selectedDurations.filter(d => d !== duration.id))
                  }
                }}
              />
              <Label htmlFor={duration.id} className="text-sm font-normal cursor-pointer">
                {duration.label}
              </Label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <h3 className="font-medium">Rating</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="rating-4" />
            <Label htmlFor="rating-4" className="text-sm font-normal cursor-pointer">
              4+ stars
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rating-3" />
            <Label htmlFor="rating-3" className="text-sm font-normal cursor-pointer">
              3+ stars
            </Label>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
