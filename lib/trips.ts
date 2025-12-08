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
  trip_id: string
  excursion_id: string
  excursion_data: any
  day?: number
  created_at: string
}

export async function createTrip(tripData: {
  name: string
  destination: string
  start_date: string
  end_date: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      ...tripData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserTrips() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function addExcursionToTrip(
  tripId: string,
  excursionId: string,
  excursionData: any,
  day?: number
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('trip_excursions')
    .insert({
      trip_id: tripId,
      excursion_id: excursionId,
      excursion_data: excursionData,
      day,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeExcursionFromTrip(tripId: string, excursionId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('trip_excursions')
    .delete()
    .eq('trip_id', tripId)
    .eq('excursion_id', excursionId)

  if (error) throw error
}

export async function getTripExcursions(tripId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('trip_excursions')
    .select('*')
    .eq('trip_id', tripId)
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
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) throw error
}
