export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ja_dict: {
        Row: {
          definitions: Json | null
          featured: string[] | null
          id: number
          readings: string[] | null
          word: string | null
        }
        Insert: {
          definitions?: Json | null
          featured?: string[] | null
          id?: number
          readings?: string[] | null
          word?: string | null
        }
        Update: {
          definitions?: Json | null
          featured?: string[] | null
          id?: number
          readings?: string[] | null
          word?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          experienced: string[]
          google_access_token: string | null
          id: string
          lang: string
          name: string | null
          stripe_id: string | null
          updated_at: string | null
        }
        Insert: {
          experienced?: string[]
          google_access_token?: string | null
          id: string
          lang?: string
          name?: string | null
          stripe_id?: string | null
          updated_at?: string | null
        }
        Update: {
          experienced?: string[]
          google_access_token?: string | null
          id?: string
          lang?: string
          name?: string | null
          stripe_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          avg_response_duration_ms: number | null
          chat_messages: Json | null
          created_at: string
          duration: number | null
          id: string
          lang: string
          n_responses: number | null
          token_usage: Json | null
          topic: string | null
          user_id: string
        }
        Insert: {
          avg_response_duration_ms?: number | null
          chat_messages?: Json | null
          created_at?: string
          duration?: number | null
          id?: string
          lang?: string
          n_responses?: number | null
          token_usage?: Json | null
          topic?: string | null
          user_id: string
        }
        Update: {
          avg_response_duration_ms?: number | null
          chat_messages?: Json | null
          created_at?: string
          duration?: number | null
          id?: string
          lang?: string
          n_responses?: number | null
          token_usage?: Json | null
          topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          created_at: string
          delay: number
          due: string
          id: string
          lang: string
          n_correct: number
          n_wrong: number
          streak: number
          time_to_response_ms: number
          user_id: string
          word_id: number
        }
        Insert: {
          created_at?: string
          delay?: number
          due?: string
          id?: string
          lang?: string
          n_correct?: number
          n_wrong?: number
          streak?: number
          time_to_response_ms?: number
          user_id: string
          word_id: number
        }
        Update: {
          created_at?: string
          delay?: number
          due?: string
          id?: string
          lang?: string
          n_correct?: number
          n_wrong?: number
          streak?: number
          time_to_response_ms?: number
          user_id?: string
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "ja_dict"
            referencedColumns: ["id"]
          },
        ]
      }
      "zh-CN_dict": {
        Row: {
          definition: string
          id: number
          pinyin: string
          word: string
        }
        Insert: {
          definition: string
          id?: number
          pinyin: string
          word: string
        }
        Update: {
          definition?: string
          id?: number
          pinyin?: string
          word?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
