import { SupabaseClient } from "@supabase/supabase-js";
import { Contact, ContactInsert, ContactUpdate } from "@/lib/db/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>;

export async function getContacts(db: DB, userId: string): Promise<Contact[]> {
  const { data, error } = await db
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getContact(
  db: DB,
  id: string,
  userId: string
): Promise<Contact | null> {
  const { data, error } = await db
    .from("contacts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function createContact(
  db: DB,
  contact: ContactInsert
): Promise<Contact> {
  const { data, error } = await db
    .from("contacts")
    .insert(contact)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContact(
  db: DB,
  id: string,
  userId: string,
  updates: ContactUpdate
): Promise<Contact> {
  const { data, error } = await db
    .from("contacts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContact(
  db: DB,
  id: string,
  userId: string
): Promise<void> {
  const { error } = await db
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
