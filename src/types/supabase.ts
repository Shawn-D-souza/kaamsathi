export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface NotificationPreferences {
  notifications: {
    messages: { push: boolean; email: boolean }
    bids: { push: boolean; email: boolean }
    job_updates: { push: boolean; email: boolean }
  }
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'seeker' | 'provider'
          preferences: NotificationPreferences
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: NotificationPreferences
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: NotificationPreferences
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          job_id: string
          sender_id: string
          content: string
          type: 'text' | 'image' | 'system' | 'location'
          read_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          job_id: string
          sender_id: string
          content: string
          type?: 'text' | 'image' | 'system' | 'location'
          read_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          job_id?: string
          sender_id?: string
          content?: string
          type?: 'text' | 'image' | 'system' | 'location'
          read_at?: string | null
          deleted_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          actor_id: string | null
          type: 'message' | 'bid' | 'job_update' | 'system'
          title: string
          body: string
          resource_id: string | null
          resource_url: string | null
          is_read: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          actor_id?: string | null
          type: 'message' | 'bid' | 'job_update' | 'system'
          title: string
          body: string
          resource_id?: string | null
          resource_url?: string | null
          is_read?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          actor_id?: string | null
          type?: 'message' | 'bid' | 'job_update' | 'system'
          title?: string
          body?: string
          resource_id?: string | null
          resource_url?: string | null
          is_read?: boolean
          metadata?: Json
        }
      }
      jobs: {
        Row: {
            id: string
            created_at: string
            owner_id: string
            title: string
            description: string
            budget: number
            deadline: string
            category: string
            status: 'open' | 'in_progress' | 'completed'
            quantity: number
            is_remote: boolean
            location: any
            radius_meters: number | null
        }
        Insert: {
            id?: string
            owner_id: string
            title: string
            description: string
            budget: number
            deadline: string
            category: string
            status?: 'open' | 'in_progress' | 'completed'
            quantity?: number
            is_remote?: boolean
            location?: any
            radius_meters?: number | null
        }
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      bids: {
        Row: {
            id: string
            job_id: string
            bidder_id: string
            amount: number
            status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
            job_id: string
            bidder_id: string
            amount: number
            status?: 'pending' | 'accepted' | 'rejected'
        }
        Update: Partial<Database['public']['Tables']['bids']['Insert']>
      }
    }
  }
}