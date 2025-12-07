"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface DayTabsProps {
  selectedDay: number
  onDayChange: (day: number) => void
  dayCounts: Array<{ day: number; date: string; count: number }>
  isLoading?: boolean
}

export function DayTabs({ selectedDay, onDayChange, dayCounts, isLoading }: DayTabsProps) {
  return (
    <div className="border-b px-4 overflow-x-auto">
      <Tabs value={selectedDay.toString()} onValueChange={(v) => onDayChange(Number(v))}>
        <TabsList className="h-auto p-0 bg-transparent border-0 rounded-none gap-6">
          {dayCounts.map(({ day, date, count }) => (
            <TabsTrigger
              key={day}
              value={day.toString()}
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">Day {day}</span>
                <span className="text-xs text-muted-foreground">{date}</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-xs text-muted-foreground">{count} activities</span>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
