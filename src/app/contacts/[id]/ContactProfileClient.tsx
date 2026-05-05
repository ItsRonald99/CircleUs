"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Building2,
  GraduationCap,
  Pencil,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TimelineCard } from "@/components/interactions/TimelineCard";
import { InteractionModal } from "@/components/interactions/InteractionModal";
import { ContactModal } from "@/components/contacts/ContactModal";
import { Contact, Interaction } from "@/lib/db/types";
import { needsReconnect, daysSinceInteraction } from "@/lib/logic/reminderLogic";

interface ContactProfileClientProps {
  contact: Contact;
  interactions: Interaction[];
}

export function ContactProfileClient({
  contact,
  interactions,
}: ContactProfileClientProps) {
  const [addInteractionOpen, setAddInteractionOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);

  const lastInteraction = interactions[0] ?? null;
  const lastDate = lastInteraction ? new Date(lastInteraction.interaction_date) : null;
  const reconnect = needsReconnect(lastDate);
  const daysSince = daysSinceInteraction(lastDate);

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Contacts
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{contact.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
              {reconnect && (
                <Badge variant="destructive" className="text-xs">
                  Needs Reconnect
                </Badge>
              )}
            </div>
            {contact.job_title && (
              <p className="text-slate-500 text-sm mt-0.5">
                {contact.job_title}
                {contact.employer && ` · ${contact.employer}`}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditContactOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left panel — Contact details */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Contact Details
              </h2>
              <div className="space-y-3">
                {contact.employer && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Employer</p>
                      <p className="text-sm font-medium text-slate-800">{contact.employer}</p>
                    </div>
                  </div>
                )}
                {contact.job_title && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Role</p>
                      <p className="text-sm font-medium text-slate-800">{contact.job_title}</p>
                    </div>
                  </div>
                )}
                {contact.school && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">School</p>
                      <p className="text-sm font-medium text-slate-800">{contact.school}</p>
                    </div>
                  </div>
                )}
                {!contact.employer && !contact.job_title && !contact.school && (
                  <p className="text-sm text-slate-400 italic">No details added yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Relationship Stats
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Total interactions</p>
                    <p className="text-sm font-semibold text-slate-800">{interactions.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Last interaction</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {lastDate
                        ? `${daysSince === 0 ? "Today" : `${daysSince}d ago`} · ${format(lastDate, "MMM d, yyyy")}`
                        : "Never"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Added on</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {format(new Date(contact.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — Timeline */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
                <p className="text-sm text-slate-400">Relationship history</p>
              </div>
              <Button
                onClick={() => setAddInteractionOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Log Interaction
              </Button>
            </div>

            {interactions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-xl">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No interactions yet</p>
                <p className="text-sm mt-1">Log your first interaction to start tracking this relationship</p>
                <Button
                  onClick={() => setAddInteractionOpen(true)}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Interaction
                </Button>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[5px] top-3 bottom-3 w-px bg-slate-200" />
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <TimelineCard
                      key={interaction.id}
                      interaction={interaction}
                      contactId={contact.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <InteractionModal
        open={addInteractionOpen}
        onClose={() => setAddInteractionOpen(false)}
        contactId={contact.id}
      />
      <ContactModal
        open={editContactOpen}
        onClose={() => setEditContactOpen(false)}
        contact={contact}
      />
    </>
  );
}
