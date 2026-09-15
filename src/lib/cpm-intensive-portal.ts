import { supabase } from "@/integrations/supabase/client";

export const CPM_ACCESS_KEY = "alp.cpm-intensive.access";
export const CPM_PORTAL_PATH = "/cpm-intensive/onboarding";
export const P6_DOWNLOAD_URL = "https://edelivery.oracle.com/";

export type CpmSession = { id: string; title: string; starts_at: string; ends_at: string; release_at: string; ended: boolean; meet_url: string | null };

export type CpmPortalState = {
  access: string;
  attendee: { name: string | null; email: string; ticket_number: string };
  schedule: { dates_label: string | null; timezone: string | null; hours: string; meet_url: string | null; sessions?: CpmSession[] };
  materials: { released: boolean; release_at: string | null; files: Array<{ id: string; title: string; description: string | null; url: string }> };
};
export type CpmCredentials = { session_id: string } | { access: string };

export function cpmCredentials(search: string, stored: string | null): CpmCredentials | null {
  const params = new URLSearchParams(search);
  if (params.has("session_id")) return { session_id: params.get("session_id") || "" };
  if (params.has("access")) return { access: params.get("access") || "" };
  return stored ? { access: stored } : null;
}

export async function loadCpmPortal(credentials: CpmCredentials): Promise<CpmPortalState> {
  // Stripe's signed webhook may arrive a moment after the browser return.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const { data, error } = await supabase.functions.invoke("cpm-intensive-portal", { body: { action: "get", ...credentials } });
    let problem = data?.error ? data : null;
    if (error) {
      try { problem = await error.context?.json?.(); } catch { /* Keep the safe fallback. */ }
    }
    if (problem?.code === "enrollment_pending" && "session_id" in credentials && attempt < 5) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      continue;
    }
    if (error || problem) throw new Error(problem?.error || "Your attendee portal could not be opened. Please try again.");
    if (!data?.access || !data?.attendee || !data?.schedule || !data?.materials) throw new Error("Your attendee portal returned an incomplete response. Please try again.");
    return data as CpmPortalState;
  }
  throw new Error("Your payment confirmation is still arriving. Please try again shortly.");
}
