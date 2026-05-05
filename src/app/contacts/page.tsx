import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";
import { getContacts } from "@/lib/services/contactService";
import { getLastInteraction } from "@/lib/services/interactionService";
import { Sidebar } from "@/components/layout/Sidebar";
import { ContactsClient } from "./ContactsClient";

export default async function ContactsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const contacts = await getContacts(supabase, user.id);

  const contactsWithLastInteraction = await Promise.all(
    contacts.map(async (contact) => {
      const last = await getLastInteraction(supabase, contact.id);
      return {
        contact,
        lastInteractionDate: last ? new Date(last.interaction_date) : null,
      };
    })
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 p-8">
        <ContactsClient contactsData={contactsWithLastInteraction} />
      </main>
    </div>
  );
}
