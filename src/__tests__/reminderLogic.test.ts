import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { needsReconnect, daysSinceInteraction } from "@/lib/logic/reminderLogic";

describe("needsReconnect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when last interaction was more than 90 days ago", () => {
    const date = new Date("2024-01-01"); // 152 days before June 1
    expect(needsReconnect(date)).toBe(true);
  });

  it("returns false when last interaction was less than 90 days ago", () => {
    const date = new Date("2024-04-01"); // 61 days before June 1
    expect(needsReconnect(date)).toBe(false);
  });

  it("returns true when lastInteractionDate is null", () => {
    expect(needsReconnect(null)).toBe(true);
  });

  it("returns false when last interaction was exactly today", () => {
    const date = new Date("2024-06-01");
    expect(needsReconnect(date)).toBe(false);
  });

  it("returns false when last interaction was 89 days ago", () => {
    const date = new Date("2024-03-04"); // 89 days before June 1
    expect(needsReconnect(date)).toBe(false);
  });

  it("returns true when last interaction was exactly 91 days ago", () => {
    const date = new Date("2024-03-02"); // 91 days before June 1
    expect(needsReconnect(date)).toBe(true);
  });
});

describe("daysSinceInteraction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns Infinity when date is null", () => {
    expect(daysSinceInteraction(null)).toBe(Infinity);
  });

  it("returns 0 when date is today", () => {
    expect(daysSinceInteraction(new Date("2024-06-01"))).toBe(0);
  });

  it("returns correct number of days", () => {
    expect(daysSinceInteraction(new Date("2024-05-01"))).toBe(31);
  });
});
