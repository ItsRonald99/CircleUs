"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import {
  getInteractions,
  createInteraction,
  deleteInteraction,
} from "@/lib/services/interactionService";
import { getContact } from "@/lib/services/contactService";

const ALLOWED_EMOJIS = new Set([
  "😊","🤝","🎉","💡","😐","😔","🔥","❤️","🙏","⭐",
]);

async function assertContactOwnership(
  db: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  contactId: string,
  userId: string
) {
  const contact = await getContact(db, contactId, userId);
  if (!contact) throw new Error("Contact not found.");
}

export async function getInteractionsAction(contactId: string) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");
  await assertContactOwnership(db, contactId, user.id);
  return getInteractions(db, contactId);
}

export async function createInteractionAction(
  contactId: string,
  formData: FormData
) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");
  await assertContactOwnership(db, contactId, user.id);

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required.");

  const interaction_date = formData.get("interaction_date") as string;
  if (!interaction_date || isNaN(Date.parse(interaction_date))) {
    throw new Error("A valid date is required.");
  }

  const rawRating = formData.get("rating");
  let rating: number | null = null;
  if (rawRating) {
    rating = Number(rawRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      throw new Error("Rating must be an integer between 1 and 10.");
    }
  }

  const emoji = (formData.get("emoji") as string) || null;
  if (emoji && !ALLOWED_EMOJIS.has(emoji)) {
    throw new Error("Invalid emoji selection.");
  }

  await createInteraction(db, {
    contact_id: contactId,
    title,
    notes: (formData.get("notes") as string)?.trim() || null,
    rating,
    emoji,
    interaction_date,
  });

  revalidatePath(`/contacts/${contactId}`);
}

export async function deleteInteractionAction(
  interactionId: string,
  contactId: string
) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/");
  await assertContactOwnership(db, contactId, user.id);

  await deleteInteraction(db, interactionId);
  revalidatePath(`/contacts/${contactId}`);
}
