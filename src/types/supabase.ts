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
          preferences: Json
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: Json
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: Json
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_locations: {
        Row: {
          id: string
          created_at: string
          provider_id: string
          location: string
          is_active: boolean
          radius_meters: number
        }
        Insert: {
          id?: string
          created_at?: string
          provider_id: string
          location: string
          is_active?: boolean
          radius_meters?: number
        }
        Update: {
          id?: string
          created_at?: string
          provider_id?: string
          location?: string
          is_active?: boolean
          radius_meters?: number
        }
        Relationships: [
          {
            foreignKeyName: "provider_locations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null // ADDED
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
          owner_id: string
          title: string
          description: string
          budget: number
          deadline: string
          category: string
          updated_at?: string | null // ADDED
          status?: 'open' | 'in_progress' | 'completed'
          quantity?: number
          is_remote?: boolean
          location?: any
          radius_meters?: number | null
        }
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
        Relationships: [
          {
            foreignKeyName: "jobs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bids: {
        Row: {
          id: string
          created_at: string
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
        Relationships: [
          {
            foreignKeyName: "bids_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
          job_id: string
          sender_id: string
          content: string
          type?: 'text' | 'image' | 'system' | 'location'
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: { id: string; rating: number; comment: string | null; job_id: string }
        Insert: { rating: number; comment?: string | null; job_id: string }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      get_relevant_jobs: {
        Args: {
          p_provider_id: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string | null
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
          profiles: {
            full_name: string | null
            avatar_url: string | null
          }
        }[]
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}