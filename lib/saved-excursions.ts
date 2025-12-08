import { createClient } from './supabase/client'

export interface SavedExcursion {
  id: string
  user_id: string
  excursion_id: string
  excursion_data: any
  created_at: string
}

export async function saveExcursion(excursionId: string, excursionData: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('saved_excursions')
    .upsert({
      user_id: user.id,
      excursion_id: excursionId,
      excursion_data: excursionData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unsaveExcursion(excursionId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('saved_excursions')
    .delete()
    .eq('user_id', user.id)
    .eq('excursion_id', excursionId)

  if (error) throw error
}

export async function getSavedExcursions() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_excursions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function isExcursionSaved(excursionId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data, error } = await supabase
    .from('saved_excursions')
    .select('id')
    .eq('user_id', user.id)
    .eq('excursion_id', excursionId)
    .single()

  if (error) return false
  return !!data
}
