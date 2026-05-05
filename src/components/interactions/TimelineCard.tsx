"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Interaction } from "@/lib/db/types";
import { deleteInteractionAction } from "@/actions/interactionActions";

interface TimelineCardProps {
  interaction: Interaction;
  contactId: string;
}

export function TimelineCard({ interaction, contactId }: TimelineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this interaction?")) return;
    startTransition(() =>
      deleteInteractionAction(interaction.id, contactId)
    );
  }

  const hasExpandable = !!interaction.notes;

  return (
    <div className="relative pl-6">
      {/* Timeline dot */}
      <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-blue-400 border-2 border-white ring-2 ring-blue-100" />

      <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {interaction.emoji && (
              <span className="text-xl leading-none">{interaction.emoji}</span>
            )}
            <span className="font-semibold text-slate-900">{interaction.title}</span>
            {interaction.rating !== null && (
              <span className="flex items-center gap-0.5 text-amber-500 text-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-slate-600 font-medium">{interaction.rating}/10</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-slate-400">
              {format(new Date(interaction.interaction_date), "MMM d, yyyy")}
            </span>
            {hasExpandable && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {expanded && interaction.notes && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 whitespace-pre-wrap">
            {interaction.notes}
          </p>
        )}

        {!expanded && interaction.notes && (
          <p
            className="mt-2 text-sm text-slate-500 line-clamp-1 cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            {interaction.notes}
          </p>
        )}
      </div>
    </div>
  );
}
