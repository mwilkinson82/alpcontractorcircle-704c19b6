// Lead capture adapter — writes to Lovable Cloud.
// Inserts into public.leads and upserts public.email_subscribers.
// Suppression: rows where unsubscribed = true are respected (the RLS
// INSERT policy on email_subscribers enforces unsubscribed = false on
// new rows; existing unsubscribed rows are left alone by the upsert
// because we use ignoreDuplicates).

import { supabase } from "@/integrations/supabase/client";

export type LeadSource =
  | "estimating"
  | "q2"
  | "silos"
  | "homepage"
  | "newsletter"
  | string;

export interface LeadInput {
  first_name: string;
  email: string;
  source: LeadSource;
}

export async function captureLead(input: LeadInput): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const first_name = input.first_name.trim();

  if (!first_name) throw new Error("First name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
  if (first_name.length > 120) throw new Error("First name is too long.");

  const source = String(input.source).slice(0, 60);

  // 1) Append to leads (every submission is a row).
  const leadInsert = await supabase
    .from("leads")
    .insert({ first_name, email, source });

  if (leadInsert.error) {
    console.error("[captureLead] leads insert failed", leadInsert.error);
    throw new Error("We couldn't save that. Please try again.");
  }

  // 2) Upsert subscriber. ignoreDuplicates avoids overwriting an
  //    existing row's unsubscribed/verified state from the client.
  const subUpsert = await supabase
    .from("email_subscribers")
    .upsert(
      { email, source, unsubscribed: false },
      { onConflict: "email", ignoreDuplicates: true },
    );

  if (subUpsert.error) {
    // Non-fatal — the lead is already saved.
    console.warn("[captureLead] subscriber upsert warning", subUpsert.error);
  }
}
