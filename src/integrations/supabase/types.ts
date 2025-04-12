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
      book_specifications: {
        Row: {
          book_id: string
          id: string
          key: string
          value: string
        }
        Insert: {
          book_id: string
          id?: string
          key: string
          value: string
        }
        Update: {
          book_id?: string
          id?: string
          key?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_specifications_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_tags: {
        Row: {
          book_id: string
          id: string
          tag_id: string
        }
        Insert: {
          book_id: string
          id?: string
          tag_id: string
        }
        Update: {
          book_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_tags_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          binding: string
          category_id: number | null
          cover_image: string
          created_at: string | null
          description: string
          edition: string | null
          has_free_delivery: boolean | null
          has_rent_option: boolean | null
          id: string
          is_available_for_resell: boolean | null
          is_new: boolean | null
          isbn: string
          language: string
          original_price: number
          page_count: number
          price: number
          publication_date: string | null
          publisher: string
          rating: number | null
          reviews: number | null
          stock_status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          binding: string
          category_id?: number | null
          cover_image: string
          created_at?: string | null
          description: string
          edition?: string | null
          has_free_delivery?: boolean | null
          has_rent_option?: boolean | null
          id?: string
          is_available_for_resell?: boolean | null
          is_new?: boolean | null
          isbn: string
          language: string
          original_price: number
          page_count: number
          price: number
          publication_date?: string | null
          publisher: string
          rating?: number | null
          reviews?: number | null
          stock_status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          binding?: string
          category_id?: number | null
          cover_image?: string
          created_at?: string | null
          description?: string
          edition?: string | null
          has_free_delivery?: boolean | null
          has_rent_option?: boolean | null
          id?: string
          is_available_for_resell?: boolean | null
          is_new?: boolean | null
          isbn?: string
          language?: string
          original_price?: number
          page_count?: number
          price?: number
          publication_date?: string | null
          publisher?: string
          rating?: number | null
          reviews?: number | null
          stock_status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          book_id: string
          cart_id: string
          created_at: string | null
          id: string
          is_rental: boolean | null
          quantity: number
          rental_period: number | null
        }
        Insert: {
          book_id: string
          cart_id: string
          created_at?: string | null
          id?: string
          is_rental?: boolean | null
          quantity?: number
          rental_period?: number | null
        }
        Update: {
          book_id?: string
          cart_id?: string
          created_at?: string | null
          id?: string
          is_rental?: boolean | null
          quantity?: number
          rental_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          book_count: number | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          book_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          book_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          is_rental: boolean | null
          order_id: string
          price: number
          quantity: number
          rental_end_date: string | null
          rental_period: number | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          is_rental?: boolean | null
          order_id: string
          price: number
          quantity?: number
          rental_end_date?: string | null
          rental_period?: number | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          is_rental?: boolean | null
          order_id?: string
          price?: number
          quantity?: number
          rental_end_date?: string | null
          rental_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          payment_method: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_state: string
          shipping_zip: string
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_method: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_state: string
          shipping_zip: string
          status: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_method?: string
          shipping_address?: string
          shipping_city?: string
          shipping_country?: string
          shipping_state?: string
          shipping_zip?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resell_requests: {
        Row: {
          asking_price: number | null
          book_author: string
          book_condition: string
          book_isbn: string | null
          book_title: string
          contact_phone: string
          created_at: string | null
          description: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asking_price?: number | null
          book_author: string
          book_condition: string
          book_isbn?: string | null
          book_title: string
          contact_phone: string
          created_at?: string | null
          description?: string | null
          id?: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asking_price?: number | null
          book_author?: string
          book_condition?: string
          book_isbn?: string | null
          book_title?: string
          contact_phone?: string
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          book_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          book_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          book_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          name: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          book_count: number
        }[]
      }
      update_book_count: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
