export type Database = {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          school: string | null;
          job_title: string | null;
          employer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          school?: string | null;
          job_title?: string | null;
          employer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          school?: string | null;
          job_title?: string | null;
          employer?: string | null;
          created_at?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          contact_id: string;
          title: string;
          notes: string | null;
          rating: number | null;
          emoji: string | null;
          interaction_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          title: string;
          notes?: string | null;
          rating?: number | null;
          emoji?: string | null;
          interaction_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          title?: string;
          notes?: string | null;
          rating?: number | null;
          emoji?: string | null;
          interaction_date?: string;
          created_at?: string;
        };
      };
    };
  };
};

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export type Interaction = Database["public"]["Tables"]["interactions"]["Row"];
export type InteractionInsert =
  Database["public"]["Tables"]["interactions"]["Insert"];
export type InteractionUpdate =
  Database["public"]["Tables"]["interactions"]["Update"];
