"use client"

import { Card } from "@/components/ui/card"
import { History } from "lucide-react"

export function BookingHistory() {
  // TODO: Fetch from Supabase
  const bookings: any[] = []

  if (bookings.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <History className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No booking history</h3>
            <p className="text-muted-foreground">
              Your clicked bookings will appear here for easy reference
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="p-6">
          <h3 className="font-semibold">{booking.title}</h3>
          <p className="text-sm text-muted-foreground">{booking.date}</p>
        </Card>
      ))}
    </div>
  )
}
