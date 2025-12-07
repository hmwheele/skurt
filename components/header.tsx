"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass, User } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Compass className="h-6 w-6" />
          <span>Excursion Hub</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
