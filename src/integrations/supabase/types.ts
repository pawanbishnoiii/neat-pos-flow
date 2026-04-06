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
      business_offers: {
        Row: {
          business_id: string
          claimed_count: number | null
          coupon_code: string | null
          created_at: string
          description: string | null
          discount_percent: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_claims: number | null
          per_user_limit: number | null
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          claimed_count?: number | null
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_claims?: number | null
          per_user_limit?: number | null
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          claimed_count?: number | null
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_claims?: number | null
          per_user_limit?: number | null
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_subscriptions: {
        Row: {
          business_id: string
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string | null
          plan_name: string
          started_at: string
          status: string
        }
        Insert: {
          business_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name?: string
          started_at?: string
          status?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          business_name: string
          category: string
          contact_email: string | null
          created_at: string
          google_map_url: string | null
          gst_number: string | null
          id: string
          instagram_handle: string | null
          logo_url: string | null
          owner_id: string
          phone: string | null
          pincode: string | null
          printer_type: string | null
          store_slug: string | null
          store_theme: string | null
          theme: string | null
          updated_at: string
          upi_id: string | null
          whatsapp_number: string | null
          youtube_handle: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          category?: string
          contact_email?: string | null
          created_at?: string
          google_map_url?: string | null
          gst_number?: string | null
          id?: string
          instagram_handle?: string | null
          logo_url?: string | null
          owner_id: string
          phone?: string | null
          pincode?: string | null
          printer_type?: string | null
          store_slug?: string | null
          store_theme?: string | null
          theme?: string | null
          updated_at?: string
          upi_id?: string | null
          whatsapp_number?: string | null
          youtube_handle?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          category?: string
          contact_email?: string | null
          created_at?: string
          google_map_url?: string | null
          gst_number?: string | null
          id?: string
          instagram_handle?: string | null
          logo_url?: string | null
          owner_id?: string
          phone?: string | null
          pincode?: string | null
          printer_type?: string | null
          store_slug?: string | null
          store_theme?: string | null
          theme?: string | null
          updated_at?: string
          upi_id?: string | null
          whatsapp_number?: string | null
          youtube_handle?: string | null
        }
        Relationships: []
      }
      credit_ledger: {
        Row: {
          amount: number
          balance_after: number
          business_id: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          type: string
        }
        Insert: {
          amount?: number
          balance_after?: number
          business_id: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          type?: string
        }
        Update: {
          amount?: number
          balance_after?: number
          business_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          type?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_visit_at: string | null
          notes: string | null
          phone: string | null
          total_spent: number
          updated_at: string
          vehicle_number: string | null
          vehicle_type: string | null
          visit_count: number
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_visit_at?: string | null
          notes?: string | null
          phone?: string | null
          total_spent?: number
          updated_at?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
          visit_count?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_visit_at?: string | null
          notes?: string | null
          phone?: string | null
          total_spent?: number
          updated_at?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
          visit_count?: number
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          business_id: string
          category: string
          created_at: string
          expense_date: string
          id: string
          notes: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          business_id: string
          category?: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          business_id?: string
          category?: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_products: {
        Row: {
          barcode_value: string | null
          brand_name: string | null
          category: string
          created_at: string
          description: string | null
          discount_price: number
          id: string
          image_url: string | null
          name: string
          price: number
          sku: string
          store_category: string
          tax_percent: number
        }
        Insert: {
          barcode_value?: string | null
          brand_name?: string | null
          category?: string
          created_at?: string
          description?: string | null
          discount_price?: number
          id?: string
          image_url?: string | null
          name: string
          price?: number
          sku: string
          store_category?: string
          tax_percent?: number
        }
        Update: {
          barcode_value?: string | null
          brand_name?: string | null
          category?: string
          created_at?: string
          description?: string | null
          discount_price?: number
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sku?: string
          store_category?: string
          tax_percent?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          price: number
          product_id: string | null
          product_name: string
          quantity: number
          total: number
        }
        Insert: {
          id?: string
          invoice_id: string
          price?: number
          product_id?: string | null
          product_name: string
          quantity?: number
          total?: number
        }
        Update: {
          id?: string
          invoice_id?: string
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_total: number
          grand_total: number
          id: string
          invoice_number: string
          payment_method: string | null
          subtotal: number
          tax_total: number
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          grand_total?: number
          id?: string
          invoice_number: string
          payment_method?: string | null
          subtotal?: number
          tax_total?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          grand_total?: number
          id?: string
          invoice_number?: string
          payment_method?: string | null
          subtotal?: number
          tax_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      printer_settings: {
        Row: {
          business_id: string
          created_at: string
          footer_text: string | null
          header_text: string | null
          id: string
          paper_size: string | null
          show_barcode: boolean | null
          show_logo: boolean | null
        }
        Insert: {
          business_id: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          paper_size?: string | null
          show_barcode?: boolean | null
          show_logo?: boolean | null
        }
        Update: {
          business_id?: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          paper_size?: string | null
          show_barcode?: boolean | null
          show_logo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_approved: boolean
          product_id: string
          rating: number
          review_text: string | null
          reviewer_email: string | null
          reviewer_name: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id: string
          rating?: number
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          rating?: number
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode_value: string | null
          brand_name: string | null
          business_id: string
          category: string
          created_at: string
          description: string | null
          discount_price: number
          id: string
          image_url: string | null
          name: string
          price: number
          qr_value: string | null
          sku: string
          stock: number
          tax_percent: number
          updated_at: string
        }
        Insert: {
          barcode_value?: string | null
          brand_name?: string | null
          business_id: string
          category?: string
          created_at?: string
          description?: string | null
          discount_price?: number
          id?: string
          image_url?: string | null
          name: string
          price?: number
          qr_value?: string | null
          sku: string
          stock?: number
          tax_percent?: number
          updated_at?: string
        }
        Update: {
          barcode_value?: string | null
          brand_name?: string | null
          business_id?: string
          category?: string
          created_at?: string
          description?: string | null
          discount_price?: number
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          qr_value?: string | null
          sku?: string
          stock?: number
          tax_percent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          language: string
          last_sign_in_at: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          language?: string
          last_sign_in_at?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          language?: string
          last_sign_in_at?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string
          encryption: string
          from_email: string
          from_name: string
          host: string
          id: string
          is_active: boolean
          password: string
          port: number
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          encryption?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean
          password?: string
          port?: number
          updated_at?: string
          username?: string
        }
        Update: {
          created_at?: string
          encryption?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean
          password?: string
          port?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      store_content: {
        Row: {
          business_id: string
          content: string | null
          created_at: string
          id: string
          is_visible: boolean | null
          section_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          content?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          content?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      store_media: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_active: boolean | null
          media_type: string
          sort_order: number | null
          title: string | null
          url: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type?: string
          sort_order?: number | null
          title?: string | null
          url: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type?: string
          sort_order?: number | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      store_theme_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_pro_only: boolean
          sort_order: number
          theme_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_pro_only?: boolean
          sort_order?: number
          theme_key: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_pro_only?: boolean
          sort_order?: number
          theme_key?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          features: Json
          id: string
          interval: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          interval?: string
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          interval?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_slug_available: { Args: { _slug: string }; Returns: boolean }
      get_store_by_slug: { Args: { _slug: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_business_owner: {
        Args: { _business_id: string; _user_id: string }
        Returns: boolean
      }
      seed_business_starter_catalog: {
        Args: { _business_id: string }
        Returns: number
      }
      upsert_customer_for_invoice: {
        Args: {
          _business_id: string
          _email: string
          _full_name: string
          _phone: string
          _vehicle_number?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "owner"
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
      app_role: ["admin", "owner"],
    },
  },
} as const
