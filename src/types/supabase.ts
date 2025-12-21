export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// --- APP INTERFACES ---
export interface NotificationPreferences {
  notifications: {
    messages: { push: boolean; email: boolean }
    bids: { push: boolean; email: boolean }
    job_updates: { push: boolean; email: boolean }
  }
}

// --- DATABASE DEFINITION ---
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
          preferences: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'seeker' | 'provider'
          preferences?: Json | null
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
          metadata: Json | null
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
          metadata?: Json | null
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
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
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
            owner_id: string
            title: string
            description: string
            budget: number
            deadline: string
            category: string
            status: 'open' | 'in_progress' | 'completed'
            quantity: number
            is_remote: boolean
            location: unknown | null
            radius_meters: number | null
            updated_at: string
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
            location?: unknown | null
            radius_meters?: number | null
            updated_at?: string
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
            proposal_text: string | null
            status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
            id?: string
            created_at?: string
            job_id: string
            bidder_id: string
            amount: number
            proposal_text?: string | null
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
      reviews: {
        Row: {
          id: string
          created_at: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_relevant_jobs: {
        Args: {
          p_provider_id: string
        }
        Returns: {
          id: string
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}