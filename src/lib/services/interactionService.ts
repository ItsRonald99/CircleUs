import { SupabaseClient } from "@supabase/supabase-js";
import {
  Interaction,
  InteractionInsert,
  InteractionUpdate,
} from "@/lib/db/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>;

export async function getInteractions(
  db: DB,
  contactId: string
): Promise<Interaction[]> {
  const { data, error } = await db
    .from("interactions")
    .select("*")
    .eq("contact_id", contactId)
    .order("interaction_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getLastInteraction(
  db: DB,
  contactId: string
): Promise<Interaction | null> {
  const { data, error } = await db
    .from("interactions")
    .select("*")
    .eq("contact_id", contactId)
    .order("interaction_date", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function createInteraction(
  db: DB,
  interaction: InteractionInsert
): Promise<Interaction> {
  const { data, error } = await db
    .from("interactions")
    .insert(interaction)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInteraction(
  db: DB,
  id: string,
  updates: InteractionUpdate
): Promise<Interaction> {
  const { data, error } = await db
    .from("interactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInteraction(db: DB, id: string): Promise<void> {
  const { error } = await db.from("interactions").delete().eq("id", id);
  if (error) throw error;
}
