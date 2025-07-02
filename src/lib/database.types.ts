export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          group_id: string | null
          active: boolean
          join_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          group_id?: string | null
          active?: boolean
          join_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          group_id?: string | null
          active?: boolean
          join_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          status: 'pending' | 'sent' | 'failed'
          total_recipients: number
          delivered_count: number
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          status?: 'pending' | 'sent' | 'failed'
          total_recipients?: number
          delivered_count?: number
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          status?: 'pending' | 'sent' | 'failed'
          total_recipients?: number
          delivered_count?: number
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      message_recipients: {
        Row: {
          id: string
          message_id: string | null
          member_id: string | null
          status: 'pending' | 'sent' | 'failed' | 'delivered'
          delivered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id?: string | null
          member_id?: string | null
          status?: 'pending' | 'sent' | 'failed' | 'delivered'
          delivered_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string | null
          member_id?: string | null
          status?: 'pending' | 'sent' | 'failed' | 'delivered'
          delivered_at?: string | null
          created_at?: string
        }
      }
      message_groups: {
        Row: {
          id: string
          message_id: string | null
          group_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id?: string | null
          group_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string | null
          group_id?: string | null
          created_at?: string
        }
      }
      sms_templates: {
        Row: {
          id: string
          name: string
          content: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}