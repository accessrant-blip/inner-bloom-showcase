export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat: {
        Row: {
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number | null
          booking_date: string
          booking_time: string
          booking_type: string
          created_at: string
          duration: number | null
          email: string
          id: string
          mode: string
          name: string
          notes: string | null
          professional_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          booking_date: string
          booking_time: string
          booking_type: string
          created_at?: string
          duration?: number | null
          email: string
          id?: string
          mode: string
          name: string
          notes?: string | null
          professional_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          booking_date?: string
          booking_time?: string
          booking_type?: string
          created_at?: string
          duration?: number | null
          email?: string
          id?: string
          mode?: string
          name?: string
          notes?: string | null
          professional_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          booking_id: string
          call_id: string
          created_at: string
          duration: number | null
          ended_at: string | null
          id: string
          professional_id: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          call_id: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          professional_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          call_id?: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          professional_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          capacity: number | null
          created_at: string
          description: string
          icon: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          next_session_at: string | null
          topic: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          next_session_at?: string | null
          topic?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          next_session_at?: string | null
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotion_suggestions: {
        Row: {
          created_at: string | null
          emotion: string
          id: string
          suggestion: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          emotion: string
          id?: string
          suggestion: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          emotion?: string
          id?: string
          suggestion?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback_form: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          recommend: string
          responsiveness: string
          suggestions: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          recommend: string
          responsiveness: string
          suggestions?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          recommend?: string
          responsiveness?: string
          suggestions?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      grounding_progress: {
        Row: {
          completed_count: number | null
          created_at: string
          id: string
          last_completed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_count?: number | null
          created_at?: string
          id?: string
          last_completed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_count?: number | null
          created_at?: string
          id?: string
          last_completed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          completed_dates: Json | null
          created_at: string
          current_streak: number | null
          habit_name: string
          id: string
          target_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_dates?: Json | null
          created_at?: string
          current_streak?: number | null
          habit_name: string
          id?: string
          target_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_dates?: Json | null
          created_at?: string
          current_streak?: number | null
          habit_name?: string
          id?: string
          target_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal: {
        Row: {
          content: string
          created_at: string
          from_ai_chat: boolean | null
          id: string
          mood_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          from_ai_chat?: boolean | null
          id?: string
          mood_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          from_ai_chat?: boolean | null
          id?: string
          mood_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "mood_journal"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reports: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reason: string | null
          reporter_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reason?: string | null
          reporter_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reason?: string | null
          reporter_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          circle_id: string
          content: string
          created_at: string
          id: string
          is_system_message: boolean | null
          sender_alias: string
          updated_at: string
          user_id: string
        }
        Insert: {
          circle_id: string
          content: string
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          sender_alias: string
          updated_at?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          content?: string
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          sender_alias?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_journal: {
        Row: {
          created_at: string
          id: string
          mood: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          currency: string
          id: string
          payment_gateway: string | null
          payment_method: string
          payment_status: string | null
          professional_id: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          currency: string
          id?: string
          payment_gateway?: string | null
          payment_method: string
          payment_status?: string | null
          professional_id: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          payment_gateway?: string | null
          payment_method?: string
          payment_status?: string | null
          professional_id?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      private_info: {
        Row: {
          age: number | null
          created_at: string
          daily_routine: string | null
          drinking: boolean | null
          id: string
          late_sleep: boolean | null
          medications: string | null
          smoking: boolean | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          daily_routine?: string | null
          drinking?: boolean | null
          id?: string
          late_sleep?: boolean | null
          medications?: string | null
          smoking?: boolean | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          daily_routine?: string | null
          drinking?: boolean | null
          id?: string
          late_sleep?: boolean | null
          medications?: string | null
          smoking?: boolean | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      professional_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          professional_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          professional_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          professional_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_availability_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          alias: string | null
          availability_status:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bio: string
          created_at: string | null
          currency: string | null
          google_form_link: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          profile_image_url: string | null
          rate_per_session: number
          role: Database["public"]["Enums"]["professional_role"]
          specialties: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alias?: string | null
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bio: string
          created_at?: string | null
          currency?: string | null
          google_form_link?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          profile_image_url?: string | null
          rate_per_session: number
          role: Database["public"]["Enums"]["professional_role"]
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alias?: string | null
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bio?: string
          created_at?: string | null
          currency?: string | null
          google_form_link?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          profile_image_url?: string | null
          rate_per_session?: number
          role?: Database["public"]["Enums"]["professional_role"]
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      rant_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          rant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          rant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          rant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rant_reports: {
        Row: {
          created_at: string
          id: string
          rant_id: string
          reason: string | null
          reporter_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rant_id: string
          reason?: string | null
          reporter_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rant_id?: string
          reason?: string | null
          reporter_user_id?: string
        }
        Relationships: []
      }
      rants: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: string | null
          privacy: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          privacy?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          privacy?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          message: string
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          message: string
          time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          message?: string
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_sessions: {
        Row: {
          calendly_event_id: string | null
          created_at: string | null
          id: string
          scheduled_at: string | null
          session_type: string
          user_id: string
        }
        Insert: {
          calendly_event_id?: string | null
          created_at?: string | null
          id?: string
          scheduled_at?: string | null
          session_type: string
          user_id: string
        }
        Update: {
          calendly_event_id?: string | null
          created_at?: string | null
          id?: string
          scheduled_at?: string | null
          session_type?: string
          user_id?: string
        }
        Relationships: []
      }
      session_feedback: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          notes: string | null
          professional_id: string
          rating: number
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          notes?: string | null
          professional_id: string
          rating: number
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          professional_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_feedback_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          booking_id: string
          created_at: string | null
          ended_at: string | null
          id: string
          professional_id: string
          session_type: string
          session_url: string | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          professional_id: string
          session_type: string
          session_url?: string | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          professional_id?: string
          session_type?: string
          session_url?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_circles: {
        Row: {
          circle_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_circles_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_sessions: {
        Row: {
          completed_at: string
          created_at: string
          duration: number | null
          id: string
          tool: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration?: number | null
          id?: string
          tool: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration?: number | null
          id?: string
          tool?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      availability_status: "online" | "offline" | "busy"
      professional_role: "listener" | "therapist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      availability_status: ["online", "offline", "busy"],
      professional_role: ["listener", "therapist"],
    },
  },
} as const
