import { createClient } from './supabase/client'

export interface Trip {
  id: string
  user_id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  created_at: string
}

export interface TripExcursion {
  id: string
  trip_plan_id: string
  excursion_id: string
  excursion_data: any
  day?: number
  created_at: string
}

export async function createTrip(tripData: {
  name: string
  destination?: string
  start_date: string
  end_date: string
}) {
  console.log('🔵 Creating trip:', tripData)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('❌ User not authenticated')
    throw new Error('User not authenticated')
  }

  console.log('✅ User authenticated:', user.id)

  const { data, error } = await supabase
    .from('trip_plans')
    .insert({
      user_id: user.id,
      ...tripData,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating trip:', error)
    throw error
  }

  console.log('✅ Trip created:', data)
  return data
}

export async function getUserTrips() {
  console.log('🔵 Getting user trips')
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log('⚠️ No user, returning empty trips')
    return []
  }

  console.log('✅ User authenticated:', user.id)

  const { data, error } = await supabase
    .from('trip_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error getting trips:', error)
    throw error
  }

  console.log('✅ Found trips:', data?.length || 0)
  return data || []
}

export async function addExcursionToTrip(
  tripId: string,
  excursionId: string,
  excursionData: any,
  day?: number
) {
  console.log('🔵 Adding excursion to trip:', { tripId, excursionId })
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('❌ User not authenticated')
    throw new Error('User not authenticated')
  }

  console.log('✅ User authenticated:', user.id)

  const { data, error } = await supabase
    .from('trip_plan_items')
    .insert({
      trip_plan_id: tripId,
      excursion_id: excursionId,
      excursion_data: excursionData,
      day,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error adding excursion to trip:', error)
    throw error
  }

  console.log('✅ Excursion added to trip:', data)
  return data
}

export async function removeExcursionFromTrip(tripId: string, excursionId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('trip_plan_items')
    .delete()
    .eq('trip_plan_id', tripId)
    .eq('excursion_id', excursionId)

  if (error) throw error
}

export async function getTripExcursions(tripId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('trip_plan_items')
    .select('*')
    .eq('trip_plan_id', tripId)
    .order('day', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function deleteTrip(tripId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('trip_plans')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) throw error
}
