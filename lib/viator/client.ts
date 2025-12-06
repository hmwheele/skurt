import type { ViatorSearchParams, ViatorProduct, ExcursionData } from '@/lib/types/viator'

const VIATOR_API_BASE = 'https://api.viator.com/partner'
const VIATOR_API_VERSION = 'v1'

export class ViatorClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Search for products by destination
   */
  async searchProducts(params: ViatorSearchParams): Promise<ExcursionData[]> {
    try {
      // For MVP, we'll use the /search/products endpoint
      // Note: Actual endpoint structure may vary based on Viator's API documentation

      const response = await fetch(`${VIATOR_API_BASE}/${VIATOR_API_VERSION}/search/products`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'exp-api-key': this.apiKey,
        },
        body: JSON.stringify({
          searchQuery: params.destination,
          currency: params.currency || 'USD',
          startDate: params.startDate,
          endDate: params.endDate,
          pagination: {
            offset: ((params.page || 1) - 1) * (params.limit || 20),
            limit: params.limit || 20,
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`Viator API error: ${response.statusText}`)
      }

      const data = await response.json()

      return this.transformProducts(data.products || [])
    } catch (error) {
      console.error('Viator API error:', error)
      throw error
    }
  }

  /**
   * Get product details by product code
   */
  async getProductDetails(productCode: string): Promise<ExcursionData | null> {
    try {
      const response = await fetch(`${VIATOR_API_BASE}/${VIATOR_API_VERSION}/product/${productCode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'exp-api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Viator API error: ${response.statusText}`)
      }

      const data = await response.json()

      return this.transformProduct(data)
    } catch (error) {
      console.error('Viator API error:', error)
      return null
    }
  }

  /**
   * Transform Viator product to our ExcursionData format
   */
  private transformProduct(product: ViatorProduct): ExcursionData {
    const durationMinutes = product.duration?.fixedDurationInMinutes ||
                           product.duration?.variableDurationFromMinutes ||
                           0

    return {
      id: product.productCode,
      title: product.title,
      description: product.description,
      price: product.pricing.summary.fromPrice,
      rating: product.reviews.combinedAverageRating,
      reviewCount: product.reviews.totalReviews,
      duration: this.formatDuration(durationMinutes),
      provider: 'Viator',
      thumbnail: product.images[0]?.imageSource || '/placeholder.svg',
      category: this.extractCategory(product.tags),
      location: product.location?.name,
      affiliateLink: this.generateAffiliateLink(product.productCode, product.productUrl),
    }
  }

  /**
   * Transform multiple products
   */
  private transformProducts(products: ViatorProduct[]): ExcursionData[] {
    return products.map(product => this.transformProduct(product))
  }

  /**
   * Format duration from minutes to readable string
   */
  private formatDuration(minutes: number): string {
    if (minutes === 0) return 'Duration varies'

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins} minutes`
    if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    return `${hours}h ${mins}m`
  }

  /**
   * Extract primary category from tags
   */
  private extractCategory(tags: Array<{ tag: string; tagId: number }>): string {
    // Map common tag IDs or names to our categories
    const categoryMap: Record<string, string> = {
      'Adventure': 'Adventure',
      'Cultural': 'Culture',
      'Food': 'Food & Drink',
      'Nature': 'Nature',
      'Water': 'Water Activities',
      'Sightseeing': 'Sightseeing',
    }

    for (const { tag } of tags) {
      for (const [key, category] of Object.entries(categoryMap)) {
        if (tag.toLowerCase().includes(key.toLowerCase())) {
          return category
        }
      }
    }

    return 'Other'
  }

  /**
   * Generate affiliate link for Viator product
   */
  private generateAffiliateLink(productCode: string, productUrl: string): string {
    // TODO: Replace with your actual Viator affiliate tracking parameters
    // This is a placeholder - you'll get the actual format from Viator
    const baseUrl = productUrl || `https://www.viator.com/tours/${productCode}`
    return `${baseUrl}?pid=YOUR_AFFILIATE_ID&mcid=42383&medium=link`
  }
}
