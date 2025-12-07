// Viator API Types

export interface ViatorSearchParams {
  destination: string
  startDate?: string
  endDate?: string
  currency?: string
  page?: number
  limit?: number
}

export interface ViatorProduct {
  productCode: string
  title: string
  description: string
  productUrl: string
  images: Array<{
    imageSource: string
    caption?: string
  }>
  pricing: {
    summary: {
      fromPrice: number
      fromPriceBeforeDiscount?: number
    }
    currency: string
  }
  reviews: {
    combinedAverageRating: number
    totalReviews: number
  }
  duration: {
    fixedDurationInMinutes?: number
    variableDurationFromMinutes?: number
    variableDurationToMinutes?: number
  }
  location?: {
    ref: string
    name: string
  }
  tags: Array<{
    tag: string
    tagId: number
  }>
}

export interface ViatorSearchResponse {
  products: ViatorProduct[]
  totalCount: number
  nextPage?: string
}

export interface ExcursionData {
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
  affiliateLink: string
  day?: number
  images?: string[]
}
