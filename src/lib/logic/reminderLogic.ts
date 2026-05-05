const RECONNECT_THRESHOLD_DAYS = 90;

export function needsReconnect(lastInteractionDate: Date | null): boolean {
  if (!lastInteractionDate) return true;
  const daysSince =
    (Date.now() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > RECONNECT_THRESHOLD_DAYS;
}

export function daysSinceInteraction(lastInteractionDate: Date | null): number {
  if (!lastInteractionDate) return Infinity;
  return Math.floor(
    (Date.now() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}
