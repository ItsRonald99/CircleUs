import { describe, it, expect, vi } from "vitest";
import {
  getInteractions,
  createInteraction,
  deleteInteraction,
} from "@/lib/services/interactionService";

describe("interactionService", () => {
  it("getInteractions returns data on success", async () => {
    const interactions = [{ id: "i1", contact_id: "c1", title: "Coffee" }];
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: interactions, error: null }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    const result = await getInteractions(db, "c1");
    expect(result).toEqual(interactions);
  });

  it("getInteractions returns empty array on null data", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    const result = await getInteractions(db, "c1");
    expect(result).toEqual([]);
  });

  it("createInteraction inserts and returns interaction", async () => {
    const interaction = {
      id: "i1",
      contact_id: "c1",
      title: "Call",
      interaction_date: "2024-03-01",
    };
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: interaction, error: null }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    const result = await createInteraction(db, {
      contact_id: "c1",
      title: "Call",
      interaction_date: "2024-03-01",
    });
    expect(result).toEqual(interaction);
  });

  it("deleteInteraction resolves without error", async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    await expect(deleteInteraction(db, "i1")).resolves.toBeUndefined();
  });

  it("createInteraction throws on error", async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error("insert failed") }),
    };
    const db = { from: vi.fn().mockReturnValue(chain) } as any;

    await expect(
      createInteraction(db, {
        contact_id: "c1",
        title: "Meeting",
        interaction_date: "2024-03-01",
      })
    ).rejects.toThrow("insert failed");
  });
});
