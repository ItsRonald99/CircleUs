"use client";

import { Users, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ContactCard } from "@/components/contacts/ContactCard";
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
  const reconnectContacts = contactsData.filter(({ lastInteractionDate }) =>
    needsReconnect(lastInteractionDate)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your relationship overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
            <Users className="w-4 h-4" />
            Total Contacts
          </div>
          <p className="text-3xl font-bold text-slate-900">{contactsData.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
            <RefreshCw className="w-4 h-4" />
            Need Reconnect
          </div>
          <p className={`text-3xl font-bold ${reconnectContacts.length > 0 ? "text-red-500" : "text-slate-900"}`}>
            {reconnectContacts.length}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Needs Reconnecting</h2>

        {reconnectContacts.length === 0 ? (
          <div className="flex items-center gap-3 text-slate-500 bg-slate-50 rounded-xl p-6">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm">You&apos;re all caught up — no contacts need reconnecting.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reconnectContacts.map(({ contact, lastInteractionDate }) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  lastInteractionDate={lastInteractionDate}
                />
              ))}
            </div>
            <div className="mt-4 text-sm">
              <Link href="/contacts" className="text-blue-600 hover:underline">
                View all {contactsData.length} contacts →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
