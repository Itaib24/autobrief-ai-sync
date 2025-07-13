export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      briefs: {
        Row: {
          content_md: string | null
          created_at: string
          id: string
          metadata: Json | null
          pdf_url: string | null
          processing_time_ms: number | null
          quality_score: number | null
          sent: boolean
          sent_at: string | null
          template: string
          transcript_id: string
        }
        Insert: {
          content_md?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          pdf_url?: string | null
          processing_time_ms?: number | null
          quality_score?: number | null
          sent?: boolean
          sent_at?: string | null
          template: string
          transcript_id: string
        }
        Update: {
          content_md?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          pdf_url?: string | null
          processing_time_ms?: number | null
          quality_score?: number | null
          sent?: boolean
          sent_at?: string | null
          template?: string
          transcript_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "briefs_transcript_id_fkey"
            columns: ["transcript_id"]
            isOneToOne: false
            referencedRelation: "transcripts"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          body_html: string
          brief_id: string
          created_at: string
          error: string | null
          id: string
          sent_at: string | null
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          body_html: string
          brief_id: string
          created_at?: string
          error?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
        }
        Update: {
          body_html?: string
          brief_id?: string
          created_at?: string
          error?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      transcriptions_enhanced: {
        Row: {
          api_request_id: string | null
          audio_duration_seconds: number | null
          audio_file_url: string | null
          audio_format: string
          average_confidence: number
          created_at: string
          error_message: string | null
          file_size_bytes: number
          full_text: string
          id: string
          language_detected: string
          original_filename: string
          processing_completed_at: string | null
          processing_options: Json | null
          processing_started_at: string | null
          processing_time_ms: number | null
          quality_score: number
          segments: Json | null
          speaker_count: number
          status: string
          updated_at: string
          user_id: string
          warnings: Json | null
          word_count: number
        }
        Insert: {
          api_request_id?: string | null
          audio_duration_seconds?: number | null
          audio_file_url?: string | null
          audio_format: string
          average_confidence?: number
          created_at?: string
          error_message?: string | null
          file_size_bytes: number
          full_text: string
          id?: string
          language_detected?: string
          original_filename: string
          processing_completed_at?: string | null
          processing_options?: Json | null
          processing_started_at?: string | null
          processing_time_ms?: number | null
          quality_score?: number
          segments?: Json | null
          speaker_count?: number
          status?: string
          updated_at?: string
          user_id: string
          warnings?: Json | null
          word_count?: number
        }
        Update: {
          api_request_id?: string | null
          audio_duration_seconds?: number | null
          audio_file_url?: string | null
          audio_format?: string
          average_confidence?: number
          created_at?: string
          error_message?: string | null
          file_size_bytes?: number
          full_text?: string
          id?: string
          language_detected?: string
          original_filename?: string
          processing_completed_at?: string | null
          processing_options?: Json | null
          processing_started_at?: string | null
          processing_time_ms?: number | null
          quality_score?: number
          segments?: Json | null
          speaker_count?: number
          status?: string
          updated_at?: string
          user_id?: string
          warnings?: Json | null
          word_count?: number
        }
        Relationships: []
      }
      transcripts: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          original_file_url: string | null
          original_text: string
          source_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          original_file_url?: string | null
          original_text: string
          source_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          original_file_url?: string | null
          original_text?: string
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          briefs_count: number | null
          briefs_limit: number | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          briefs_count?: number | null
          briefs_limit?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          briefs_count?: number | null
          briefs_limit?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
