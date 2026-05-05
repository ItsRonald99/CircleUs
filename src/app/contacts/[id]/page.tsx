import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { redirect, notFound } from "next/navigation";
import { getContact } from "@/lib/services/contactService";
import { getInteractions } from "@/lib/services/interactionService";
import { Sidebar } from "@/components/layout/Sidebar";
import { ContactProfileClient } from "./ContactProfileClient";

export default async function ContactProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [contact, interactions] = await Promise.all([
    getContact(supabase, id, user.id),
    getInteractions(supabase, id),
  ]);

  if (!contact) notFound();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 p-8">
        <ContactProfileClient contact={contact} interactions={interactions} />
      </main>
    </div>
  );
}
