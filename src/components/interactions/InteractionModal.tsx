"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInteractionAction } from "@/actions/interactionActions";

const EMOJIS = ["😊", "🤝", "🎉", "💡", "😐", "😔", "🔥", "❤️", "🙏", "⭐"];

interface InteractionModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string;
}

export function InteractionModal({
  open,
  onClose,
  contactId,
}: InteractionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("emoji", selectedEmoji);

    if (!formData.get("title")) {
      setError("Title is required.");
      return;
    }
    if (!formData.get("interaction_date")) {
      setError("Date is required.");
      return;
    }

    startTransition(async () => {
      try {
        await createInteractionAction(contactId, formData);
        setSelectedEmoji("");
        onClose();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Interaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Coffee chat, LinkedIn message"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction_date">Date *</Label>
            <Input
              id="interaction_date"
              name="interaction_date"
              type="date"
              defaultValue={today}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rating">Rating (1–10)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="10"
              placeholder="How did it go?"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Mood</Label>
            <div className="flex gap-2 flex-wrap">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() =>
                    setSelectedEmoji(selectedEmoji === emoji ? "" : emoji)
                  }
                  className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? "bg-blue-100 ring-2 ring-blue-400 scale-110"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What did you talk about?"
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Log Interaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
