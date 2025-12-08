import type { ViatorSearchParams, ViatorProduct, ExcursionData } from '@/lib/types/viator'

const VIATOR_API_BASE = 'https://api.viator.com/partner'

// Common destination IDs for Viator API
// Source: Viator Partner API documentation
const DESTINATION_MAPPING: Record<string, number> = {
  // North America - Major Cities
  'san francisco': 1139,
  'new york': 685,
  'new york city': 685,
  'nyc': 685,
  'las vegas': 684,
  'los angeles': 688,
  'orlando': 689,
  'miami': 690,
  'chicago': 691,
  'washington': 692,
  'washington dc': 692,
  'boston': 693,
  'seattle': 694,
  'usa': 684,
  'united states': 684,

  // Europe
  'paris': 479,
  'london': 502,
  'rome': 490,
  'barcelona': 4900,
  'amsterdam': 525,
  'berlin': 4919,
  'prague': 4918,
  'vienna': 4917,
  'venice': 490,
  'madrid': 4900,
  'france': 479,
  'uk': 502,
  'england': 502,
  'italy': 490,
  'spain': 4900,
  'germany': 4919,

  // Asia
  'tokyo': 526,
  'bangkok': 5085,
  'singapore': 5085,
  'hong kong': 5085,
  'dubai': 5085,
  'bali': 5085,
  'japan': 526,
  'thailand': 5085,

  // Australia & Pacific
  'sydney': 627,
  'melbourne': 627,
  'australia': 627,

  // South America
  'rio': 5751,
  'brazil': 5751,

  // Other
  'mexico': 684,
  'canada': 684,
}

export class ViatorClient {
  private apiKey: string
  private currentDestination: string = ''

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Get destination ID from mapping
   */
  private getDestinationIdFromMapping(destinationName: string): number | null {
    const normalized = destinationName.toLowerCase().trim()

    // Try exact match first
    if (DESTINATION_MAPPING[normalized]) {
      return DESTINATION_MAPPING[normalized]
    }

    // Try partial matches
    for (const [key, id] of Object.entries(DESTINATION_MAPPING)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        console.log('✅ Matched destination:', destinationName, '→', key, '(ID:', id, ')')
        return id
      }
    }

    return null
  }

  /**
   * Search for destination ID by name
   */
  private async searchDestination(destinationName: string): Promise<number | null> {
    // First try the mapping (faster and more reliable for affiliate partners)
    const mappedId = this.getDestinationIdFromMapping(destinationName)
    if (mappedId) {
      console.log('✅ Found destination ID from mapping:', mappedId, 'for', destinationName)
      return mappedId
    }

    // If mapping fails, try API lookup
    try {
      console.log('🔍 Looking up destination ID via API for:', destinationName)

      const response = await fetch(`${VIATOR_API_BASE}/taxonomy/destinations`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': this.apiKey,
        },
        body: JSON.stringify({
          searchTerm: destinationName,
        }),
      })

      if (!response.ok) {
        console.warn('⚠️ Destination API lookup failed:', response.status, '- using mapping fallback')
        return null
      }

      const data = await response.json()
      const destinations = data.destinations || data.data || []

      if (destinations.length > 0) {
        const destinationId = destinations[0].destinationId || destinations[0].id
        console.log('✅ Found destination ID via API:', destinationId, 'for', destinationName)
        return destinationId
      }

      return null
    } catch (error) {
      console.warn('⚠️ Destination API lookup error:', error)
      return null
    }
  }

  /**
   * Search for products by destination
   */
  async searchProducts(params: ViatorSearchParams): Promise<ExcursionData[]> {
    try {
      // First, look up the destination ID
      console.log('🔍 Searching Viator API for:', params.destination)

      // Store destination for use in product transformation
      this.currentDestination = params.destination

      const destinationId = await this.searchDestination(params.destination)

      if (!destinationId) {
        console.error('❌ Could not find destination ID for:', params.destination)
        throw new Error(`Destination not found: ${params.destination}`)
      }

      const requestBody = {
        filtering: {
          destination: destinationId,
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
        currency: params.currency || 'USD',
        pagination: {
          offset: ((params.page || 1) - 1) * (params.limit || 20),
          limit: params.limit || 20,
        },
      }

      console.log('📤 Viator API request body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${VIATOR_API_BASE}/products/search`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📡 Viator API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Viator API error response:', errorText)
        console.error('❌ Viator API error status:', response.status, response.statusText)
        throw new Error(`Viator API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Viator API response structure:', Object.keys(data))
      console.log('✅ Viator API data preview:', JSON.stringify(data).substring(0, 500))

      // Try different possible response structures
      const products = data.products || data.data || data.results || []
      console.log('✅ Viator API returned', products.length, 'products')

      // Log first product structure to help debug
      if (products.length > 0) {
        console.log('📦 First product keys:', Object.keys(products[0]))
        console.log('📦 First product full:', JSON.stringify(products[0], null, 2))

        // Log image-related fields specifically
        if (products[0].images) {
          console.log('📸 Images field:', JSON.stringify(products[0].images))
        }

        // Log location-related fields
        console.log('📍 Location fields:', {
          location: products[0].location,
          destinationName: products[0].destinationName,
          destination: products[0].destination,
        })
      }

      return this.transformProducts(products)
    } catch (error) {
      console.error('❌ Viator API error:', error)
      throw error
    }
  }

  /**
   * Get product details by product code
   */
  async getProductDetails(productCode: string): Promise<ExcursionData | null> {
    try {
      const response = await fetch(`${VIATOR_API_BASE}/products/${productCode}`, {
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
  private transformProduct(product: any, index: number = 0): ExcursionData {
    try {
      // Handle different possible API response structures
      const durationMinutes = product.duration?.fixedDurationInMinutes ||
                             product.duration?.variableDurationFromMinutes ||
                             product.durationInMinutes ||
                             0

      // Extract up to 3 images - handle different structures
      let images: string[] = []

      if (Array.isArray(product.images) && product.images.length > 0) {
        images = product.images
          .slice(0, 3)
          .map((img: any) => {
            // If variants exist, get a large variant (674x446 or 720x480)
            if (img.variants && Array.isArray(img.variants)) {
              // Try to get 674x446 (index 6) or 720x480 (index 7), fallback to largest available
              return img.variants[6]?.url || img.variants[7]?.url || img.variants[img.variants.length - 1]?.url
            }
            // Fallback to other field names
            return img.imageSource || img.url || (typeof img === 'string' ? img : null)
          })
          .filter(Boolean)
      } else if (product.image?.url) {
        images = [product.image.url]
      } else if (product.thumbnailHiResURL) {
        images = [product.thumbnailHiResURL]
      } else if (product.thumbnailURL) {
        images = [product.thumbnailURL]
      }

      const price = product.pricing?.summary?.fromPrice ||
                   product.price?.amount ||
                   product.priceFormatted?.replace(/[^0-9.]/g, '') ||
                   0

      return {
        id: product.productCode || product.code || `viator-${index}`,
        title: product.title || 'Untitled Experience',
        description: product.description || product.shortDescription || 'No description available',
        price: typeof price === 'number' ? price : parseFloat(price) || 0,
        rating: product.reviews?.combinedAverageRating || product.rating || 4.5,
        reviewCount: product.reviews?.totalReviews || product.reviewCount || 0,
        duration: this.formatDuration(durationMinutes),
        provider: 'Viator',
        thumbnail: images[0] || product.thumbnailURL || product.thumbnailHiResURL || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        category: this.extractCategory(product.tags || product.categories || []),
        location: product.location?.name ||
                 product.destinationName ||
                 product.destination?.name ||
                 product.locationInfo?.name ||
                 product.address?.city ||
                 this.currentDestination ||
                 'Location not specified',
        affiliateLink: this.generateAffiliateLink(
          product.productCode || product.code,
          product.productUrl || product.webURL
        ),
        images: images.length > 0 ? images : undefined,
        // Assign to random day (1-7) for multi-day trip support
        day: (index % 7) + 1,
      }
    } catch (error) {
      console.error('Error transforming product:', error, product)
      throw error
    }
  }

  /**
   * Transform multiple products
   */
  private transformProducts(products: any[]): ExcursionData[] {
    const transformed: ExcursionData[] = []

    for (let i = 0; i < products.length; i++) {
      try {
        const excursion = this.transformProduct(products[i], i)
        transformed.push(excursion)
      } catch (error) {
        console.error(`⚠️ Failed to transform product ${i}:`, error)
        console.error(`⚠️ Problem product:`, JSON.stringify(products[i]).substring(0, 500))
        // Continue processing other products
      }
    }

    console.log(`✅ Successfully transformed ${transformed.length} of ${products.length} products`)
    return transformed
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
  private extractCategory(tags: any[]): string {
    if (!Array.isArray(tags) || tags.length === 0) {
      return 'Sightseeing'
    }

    // Map common tag IDs or names to our categories
    const categoryMap: Record<string, string> = {
      'Adventure': 'Adventure',
      'Cultural': 'Culture',
      'Culture': 'Culture',
      'Food': 'Food & Drink',
      'Nature': 'Nature',
      'Water': 'Water Activities',
      'Sightseeing': 'Sightseeing',
      'Museum': 'Culture',
      'Historical': 'Culture',
      'Beach': 'Water Activities',
      'Outdoor': 'Adventure',
    }

    for (const tag of tags) {
      const tagName = typeof tag === 'string' ? tag : tag.tag || tag.name || ''
      for (const [key, category] of Object.entries(categoryMap)) {
        if (tagName.toLowerCase().includes(key.toLowerCase())) {
          return category
        }
      }
    }

    return 'Sightseeing'
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
