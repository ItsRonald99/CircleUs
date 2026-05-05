"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactCard } from "@/components/contacts/ContactCard";
import { ContactModal } from "@/components/contacts/ContactModal";
import { Contact } from "@/lib/db/types";
import { needsReconnect } from "@/lib/logic/reminderLogic";

interface ContactData {
  contact: Contact;
  lastInteractionDate: Date | null;
}

interface DashboardClientProps {
  contactsData: ContactData[];
}

export function DashboardClient({ contactsData }: DashboardClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const reconnectCount = contactsData.filter(({ lastInteractionDate }) =>
    needsReconnect(lastInteractionDate)
  ).length;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {contactsData.length} total
              {reconnectCount > 0 && (
                <span className="text-red-500 ml-2">
                  · {reconnectCount} need reconnecting
                </span>
              )}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Contact
          </Button>
        </div>

        {contactsData.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No contacts yet</p>
            <p className="text-sm mt-1">Add your first contact to get started</p>
            <Button
              onClick={() => setCreateOpen(true)}
              variant="outline"
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactsData.map(({ contact, lastInteractionDate }) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                lastInteractionDate={lastInteractionDate}
              />
            ))}
          </div>
        )}
      </div>

      <ContactModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
