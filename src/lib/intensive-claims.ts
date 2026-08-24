import { supabase } from "@/integrations/supabase/client";

export interface IntensiveClaimInput {
  purchaser_email: string;
  submitter_name: string;
  company_name: string;
  project_name: string;
  claim_stage: "active-delay" | "notice-preparation" | "claim-development" | "submitted" | "disputed" | "other";
  amount_at_issue?: string;
  claim_summary: string;
  records_available: string;
  redaction_notes?: string;
  discussion_permission: boolean;
  website?: string;
}

const clean = (value: string) => value.trim().replace(/\s{3,}/g, "  ");

export async function submitIntensiveClaim(input: IntensiveClaimInput): Promise<void> {
  if (input.website) return;

  const payload = {
    purchaser_email: input.purchaser_email.trim().toLowerCase(),
    submitter_name: clean(input.submitter_name),
    company_name: clean(input.company_name),
    project_name: clean(input.project_name),
    claim_stage: input.claim_stage,
    amount_at_issue: clean(input.amount_at_issue ?? "") || null,
    claim_summary: clean(input.claim_summary),
    records_available: clean(input.records_available),
    redaction_notes: clean(input.redaction_notes ?? "") || null,
    discussion_permission: input.discussion_permission,
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.purchaser_email)) {
    throw new Error("Enter the same valid email address used at checkout.");
  }
  if (payload.submitter_name.length < 2 || payload.company_name.length < 2 || payload.project_name.length < 2) {
    throw new Error("Complete your name, company, and project name.");
  }
  if (payload.claim_summary.length < 40) {
    throw new Error("Give Marshall at least a short paragraph describing the delay or claim.");
  }
  if (payload.records_available.length < 10) {
    throw new Error("Tell us which project records are available.");
  }
  if (!payload.discussion_permission) {
    throw new Error("Permission is required before Marshall can consider the claim for a live dissection.");
  }

  const { error } = await supabase.from("intensive_claim_submissions").insert(payload);
  if (error) {
    console.error("[submitIntensiveClaim] insert failed", error);
    throw new Error("We couldn't save the claim candidate. Please try again or email Marshall.");
  }
}
