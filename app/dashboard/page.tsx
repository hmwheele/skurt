"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavedExcursions } from "@/components/saved-excursions"
import { TripPlanner } from "@/components/trip-planner"
import { BookingHistory } from "@/components/booking-history"
import { AuthModal } from "@/components/auth-modal"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("saved")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    } else {
      setShowAuthModal(true)
    }
  }, [])

  const handleAuthSuccess = () => {
    localStorage.setItem("isAuthenticated", "true")
    setIsAuthenticated(true)
    setShowAuthModal(false)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onSuccess={handleAuthSuccess} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your saved excursions, trip plans, and bookings</p>
        </div>

        {isAuthenticated ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="trips">Trip Plans</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="saved">
              <SavedExcursions />
            </TabsContent>

            <TabsContent value="trips">
              <TripPlanner />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingHistory />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Please log in to view your dashboard</p>
          </div>
        )}
      </main>
    </div>
  )
}
