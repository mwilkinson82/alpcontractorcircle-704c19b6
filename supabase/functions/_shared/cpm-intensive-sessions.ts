type Session = { id?: unknown; title?: unknown; starts_at?: unknown; ends_at?: unknown; meet_url?: unknown };

// Never send unreleased conference URLs or host calendar event IDs to a browser.
export function publicCpmSessions(value: unknown, now = Date.now()) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: Session) => {
    if (!item || typeof item.id !== "string" || typeof item.title !== "string" || typeof item.starts_at !== "string" || typeof item.ends_at !== "string") return [];
    const start = Date.parse(item.starts_at), end = Date.parse(item.ends_at);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
    const release = start - 60 * 60 * 1000;
    const validMeet = typeof item.meet_url === "string" && /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(item.meet_url);
    return [{ id: item.id, title: item.title, starts_at: item.starts_at, ends_at: item.ends_at,
      release_at: new Date(release).toISOString(), ended: now >= end,
      meet_url: validMeet && now >= release && now < end ? item.meet_url as string : null }];
  });
}
