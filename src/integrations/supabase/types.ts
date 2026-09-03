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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      drip_enrollments: {
        Row: {
          converted_at: string | null
          created_at: string
          current_step: number
          email: string
          enrolled_at: string
          first_name: string | null
          id: string
          next_send_at: string | null
          sequence_id: string
          status: string
          updated_at: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          current_step?: number
          email: string
          enrolled_at?: string
          first_name?: string | null
          id?: string
          next_send_at?: string | null
          sequence_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          current_step?: number
          email?: string
          enrolled_at?: string
          first_name?: string | null
          id?: string
          next_send_at?: string | null
          sequence_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      drip_sent_emails: {
        Row: {
          email: string
          enrollment_id: string
          error_message: string | null
          id: string
          provider_message_id: string | null
          sent_at: string
          sequence_id: string
          status: string
          step_number: number
        }
        Insert: {
          email: string
          enrollment_id: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          sent_at?: string
          sequence_id: string
          status?: string
          step_number: number
        }
        Update: {
          email?: string
          enrollment_id?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          sent_at?: string
          sequence_id?: string
          status?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "drip_sent_emails_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "drip_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          suppression_reason: string | null
          unsubscribed: boolean
          unsubscribed_at: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          suppression_reason?: string | null
          unsubscribed?: boolean
          unsubscribed_at?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          suppression_reason?: string | null
          unsubscribed?: boolean
          unsubscribed_at?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      intensive_claim_attachments: {
        Row: {
          claim_submission_id: string | null
          created_at: string
          enrollment_id: string
          id: string
          mime_type: string
          original_name: string
          size_bytes: number
          storage_path: string
        }
        Insert: {
          claim_submission_id?: string | null
          created_at?: string
          enrollment_id: string
          id?: string
          mime_type: string
          original_name: string
          size_bytes: number
          storage_path: string
        }
        Update: {
          claim_submission_id?: string | null
          created_at?: string
          enrollment_id?: string
          id?: string
          mime_type?: string
          original_name?: string
          size_bytes?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "intensive_claim_attachments_claim_submission_id_fkey"
            columns: ["claim_submission_id"]
            isOneToOne: false
            referencedRelation: "intensive_claim_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intensive_claim_attachments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "intensive_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      intensive_claim_submissions: {
        Row: {
          amount_at_issue: string | null
          claim_stage: string
          claim_summary: string
          company_name: string
          created_at: string
          discussion_permission: boolean
          enrollment_id: string | null
          id: string
          internal_notes: string | null
          project_name: string
          purchase_status: string
          purchaser_email: string
          records_available: string
          redaction_notes: string | null
          review_notified_at: string | null
          selected_for_live_dissection: boolean
          submitted_via_portal: boolean
          submitter_name: string
        }
        Insert: {
          amount_at_issue?: string | null
          claim_stage: string
          claim_summary: string
          company_name: string
          created_at?: string
          discussion_permission?: boolean
          enrollment_id?: string | null
          id?: string
          internal_notes?: string | null
          project_name: string
          purchase_status?: string
          purchaser_email: string
          records_available: string
          redaction_notes?: string | null
          review_notified_at?: string | null
          selected_for_live_dissection?: boolean
          submitted_via_portal?: boolean
          submitter_name: string
        }
        Update: {
          amount_at_issue?: string | null
          claim_stage?: string
          claim_summary?: string
          company_name?: string
          created_at?: string
          discussion_permission?: boolean
          enrollment_id?: string | null
          id?: string
          internal_notes?: string | null
          project_name?: string
          purchase_status?: string
          purchaser_email?: string
          records_available?: string
          redaction_notes?: string | null
          review_notified_at?: string | null
          selected_for_live_dissection?: boolean
          submitted_via_portal?: boolean
          submitter_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "intensive_claim_submissions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "intensive_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      intensive_email_events: {
        Row: {
          attempt_count: number
          created_at: string
          email_kind: string
          enrollment_id: string
          id: string
          last_error: string | null
          provider_message_id: string | null
          recipient: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          email_kind: string
          enrollment_id: string
          id?: string
          last_error?: string | null
          provider_message_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          email_kind?: string
          enrollment_id?: string
          id?: string
          last_error?: string | null
          provider_message_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intensive_email_events_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "intensive_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      intensive_enrollments: {
        Row: {
          access_token: string
          amount_total: number | null
          attendee_names: Json
          audience_channel: string
          can_submit_claim: boolean | null
          checkout_reference: string | null
          company_name: string | null
          created_at: string
          currency: string | null
          enrollment_type: string
          funnel_session_id: string | null
          id: string
          materials_release_at: string
          onboarding_completed_at: string | null
          pass_kind: string
          payment_status: string
          phone: string | null
          preparation_notes: string | null
          purchaser_email: string
          purchaser_name: string | null
          reporting_status: string
          seat_override_reason: string | null
          seats: number
          stripe_checkout_session_id: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_link_id: string
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          access_token?: string
          amount_total?: number | null
          attendee_names?: Json
          audience_channel?: string
          can_submit_claim?: boolean | null
          checkout_reference?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          enrollment_type: string
          funnel_session_id?: string | null
          id?: string
          materials_release_at?: string
          onboarding_completed_at?: string | null
          pass_kind?: string
          payment_status?: string
          phone?: string | null
          preparation_notes?: string | null
          purchaser_email: string
          purchaser_name?: string | null
          reporting_status?: string
          seat_override_reason?: string | null
          seats: number
          stripe_checkout_session_id: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_link_id: string
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          access_token?: string
          amount_total?: number | null
          attendee_names?: Json
          audience_channel?: string
          can_submit_claim?: boolean | null
          checkout_reference?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          enrollment_type?: string
          funnel_session_id?: string | null
          id?: string
          materials_release_at?: string
          onboarding_completed_at?: string | null
          pass_kind?: string
          payment_status?: string
          phone?: string | null
          preparation_notes?: string | null
          purchaser_email?: string
          purchaser_name?: string | null
          reporting_status?: string
          seat_override_reason?: string | null
          seats?: number
          stripe_checkout_session_id?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_link_id?: string
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      intensive_funnel_events: {
        Row: {
          audience_channel: string
          enrollment_type: string | null
          event_type: string
          id: string
          occurred_at: string
          page_path: string
          referrer_host: string | null
          session_id: string
          visitor_id: string
        }
        Insert: {
          audience_channel: string
          enrollment_type?: string | null
          event_type: string
          id?: string
          occurred_at?: string
          page_path: string
          referrer_host?: string | null
          session_id: string
          visitor_id: string
        }
        Update: {
          audience_channel?: string
          enrollment_type?: string | null
          event_type?: string
          id?: string
          occurred_at?: string
          page_path?: string
          referrer_host?: string | null
          session_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      intensive_materials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          sort_order: number
          storage_path: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          storage_path: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          storage_path?: string
          title?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          source: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      intensive_conversion_dashboard: {
        Row: {
          audience_channel: string | null
          checkout_starts: number | null
          checkout_to_purchase_percent: number | null
          enrollment_type: string | null
          gross_revenue_cents: number | null
          landing_sessions: number | null
          landing_visitors: number | null
          last_checkout_at: string | null
          last_purchase_at: string | null
          last_visit_at: string | null
          paid_purchases: number | null
          paid_seats: number | null
          visitor_to_purchase_percent: number | null
        }
        Relationships: []
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
