import { HeroSection } from "@/components/hero-section"
import { Header } from "@/components/header"
import { RecentSearches } from "@/components/recent-searches"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <RecentSearches />
    </div>
  )
}
