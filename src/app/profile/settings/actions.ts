'use server'

import { createClient } from '@/utils/supabase/server'
import { NotificationPreferences, Json } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

const DEFAULT_PREFERENCES: NotificationPreferences = {
  notifications: {
    messages: { push: true, email: true },
    bids: { push: true, email: true },
    job_updates: { push: true, email: true }
  }
}

export async function getNotificationSettings(): Promise<{ success: boolean; data?: NotificationPreferences; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Safe cast: We know the JSON structure matches our interface
  const preferences = (data.preferences as unknown as NotificationPreferences) || DEFAULT_PREFERENCES

  return { success: true, data: preferences }
}

export async function updateNotificationSettings(newSettings: NotificationPreferences): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ preferences: newSettings as unknown as Json }) // Added Cast
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile/settings')
  return { success: true }
}
