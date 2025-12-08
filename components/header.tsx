"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Compass, User, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"

export function Header() {
  const { user, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Compass className="h-6 w-6" />
            <span>Skurt</span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs text-muted-foreground">Logged in as</p>
                          <p className="text-sm font-medium leading-none">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  )
}
