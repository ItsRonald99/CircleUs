import { describe, it, expect, vi } from "vitest";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/services/contactService";

function makeDb(overrides: Record<string, unknown> = {}) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    ...overrides,
  };
  return { from: vi.fn().mockReturnValue(chain), _chain: chain } as any;
}

describe("contactService", () => {
  it("getContacts returns data on success", async () => {
    const contacts = [{ id: "1", name: "Alice", user_id: "u1" }];
    const { db, chain } = (() => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: contacts, error: null }),
      };
      return { db: { from: vi.fn().mockReturnValue(chain) } as any, chain };
    })();

    const result = await getContacts(db, "u1");
    expect(result).toEqual(contacts);
  });

  it("getContacts throws on error", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    await expect(getContacts(db, "u1")).rejects.toThrow("DB error");
  });

  it("getContact returns null when not found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error("not found") }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    const result = await getContact(db, "fake-id", "u1");
    expect(result).toBeNull();
  });

  it("createContact returns created contact", async () => {
    const contact = { id: "1", name: "Bob", user_id: "u1" };
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: contact, error: null }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    const result = await createContact(db, { user_id: "u1", name: "Bob" });
    expect(result).toEqual(contact);
  });

  it("deleteContact calls delete", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    // Second .eq() returns the final promise
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: null });
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    await expect(deleteContact(db, "1", "u1")).resolves.toBeUndefined();
  });
});
