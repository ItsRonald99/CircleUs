"use client";

import { useRef, useState, useTransition } from "react";
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
import { createContactAction, updateContactAction } from "@/actions/contactActions";
import { Contact } from "@/lib/db/types";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact;
}

export function ContactModal({ open, onClose, contact }: ContactModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    if (!formData.get("name")) {
      setError("Name is required.");
      return;
    }

    startTransition(async () => {
      try {
        if (contact) {
          await updateContactAction(contact.id, formData);
        } else {
          await createContactAction(formData);
        }
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
          <DialogTitle>{contact ? "Edit Contact" : "New Contact"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={contact?.name}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              name="school"
              defaultValue={contact?.school ?? ""}
              placeholder="University or school"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                defaultValue={contact?.job_title ?? ""}
                placeholder="Role"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                name="employer"
                defaultValue={contact?.employer ?? ""}
                placeholder="Company"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : contact ? "Save Changes" : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
