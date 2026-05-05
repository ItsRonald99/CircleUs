"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Building2, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Contact } from "@/lib/db/types";
import { needsReconnect } from "@/lib/logic/reminderLogic";
import { ContactModal } from "./ContactModal";
import { deleteContactAction } from "@/actions/contactActions";

interface ContactCardProps {
  contact: Contact;
  lastInteractionDate: Date | null;
}

export function ContactCard({ contact, lastInteractionDate }: ContactCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const reconnect = needsReconnect(lastInteractionDate);

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleDelete() {
    if (!confirm(`Delete ${contact.name}?`)) return;
    await deleteContactAction(contact.id);
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all group">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900 truncate">{contact.name}</p>
                {reconnect && (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    Needs Reconnect
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-0.5 mt-0.5">
                {contact.job_title && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 shrink-0" />
                    {contact.job_title}
                    {contact.employer && ` · ${contact.employer}`}
                  </p>
                )}
                {contact.school && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <GraduationCap className="w-3 h-3 shrink-0" />
                    {contact.school}
                  </p>
                )}
              </div>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent transition-colors"
              aria-label="Contact options"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ContactModal open={editOpen} onClose={() => setEditOpen(false)} contact={contact} />
    </>
  );
}
