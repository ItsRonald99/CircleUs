"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/services/contactService";

export async function getContactsAction() {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");
  return getContacts(db, user.id);
}

export async function getContactAction(id: string) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");
  return getContact(db, id, user.id);
}

export async function createContactAction(formData: FormData) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  await createContact(db, {
    user_id: user.id,
    name,
    school: (formData.get("school") as string)?.trim() || null,
    job_title: (formData.get("job_title") as string)?.trim() || null,
    employer: (formData.get("employer") as string)?.trim() || null,
  });

  revalidatePath("/dashboard");
}

export async function updateContactAction(id: string, formData: FormData) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name is required.");

  await updateContact(db, id, user.id, {
    name,
    school: (formData.get("school") as string)?.trim() || null,
    job_title: (formData.get("job_title") as string)?.trim() || null,
    employer: (formData.get("employer") as string)?.trim() || null,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/contacts/${id}`);
}

export async function deleteContactAction(id: string) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");

  await deleteContact(db, id, user.id);
  revalidatePath("/dashboard");
}
