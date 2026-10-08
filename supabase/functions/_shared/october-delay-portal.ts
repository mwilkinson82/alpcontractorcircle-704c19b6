import { octoberDelaySessions } from "./delay-confirmation-cohort.ts";

// October resources are explicitly configured; never fall back to September files
// or INTENSIVE_ZOOM_URL. Absent/malformed settings produce truthful pending states.
export function octoberDelayPortalConfig(get: (name: string) => string | undefined, now: Date) {
  const rawRelease = get("OCTOBER_DELAY_MATERIALS_RELEASE_AT");
  const release = rawRelease && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(rawRelease) ? new Date(rawRelease) : null;
  const releaseAt = release && Number.isFinite(release.getTime()) ? release.toISOString() : null;
  const fileIds = (get("OCTOBER_DELAY_MATERIAL_IDS") || "").split(",").map((id) => id.trim()).filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
  let rooms: Record<string, unknown> = {};
  try { rooms = JSON.parse(get("OCTOBER_DELAY_ROOM_URLS") || "{}"); } catch { /* pending */ }
  if (!rooms || typeof rooms !== "object" || Array.isArray(rooms)) rooms = {};
  const sessions = octoberDelaySessions.map((session) => {
    const candidate = rooms[session.date];
    const valid = typeof candidate === "string" && /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(candidate);
    const roomOpen = now.getTime() >= new Date(session.startsAt).getTime() - 3600000 && now.getTime() <= new Date(session.endsAt).getTime();
    return { ...session, room_url: valid && roomOpen ? candidate : null, room_status: valid ? "scheduled" : "pending" };
  });
  return { releaseAt, fileIds, materialsReleased: Boolean(releaseAt && fileIds.length && now >= new Date(releaseAt)), sessions };
}
