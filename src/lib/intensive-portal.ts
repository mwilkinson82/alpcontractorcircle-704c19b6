import { supabase } from "@/integrations/supabase/client";
import {
  enrollmentCanSubmitClaim,
  PASS_KIND_NAMED_SEAT,
  type IntensivePassKind,
} from "@/lib/intensive-pass";

export type PortalState = {
  access: string;
  pass_kind: IntensivePassKind;
  can_submit_claim: boolean;
  attendee: {
    email: string;
    name: string | null;
    company_name: string | null;
    attendee_names: string[];
    phone: string | null;
    preparation_notes: string | null;
    enrollment_type: "individual" | "company";
    seats: number;
    ticket_number: string;
    onboarding_completed_at: string | null;
  };
  claim: null | {
    id: string;
    project_name: string;
    claim_stage: string;
    created_at: string;
    selected_for_live_dissection: boolean;
  };
  materials: {
    released: boolean;
    release_at: string;
    zoom_url: string | null;
    files: Array<{ id: string; title: string; description: string | null; url: string }>;
  };
};

export type ClaimAttachment = {
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
};

export function buildPreviewPortalState(passKind: IntensivePassKind = "purchaser"): PortalState {
  const named = passKind === PASS_KIND_NAMED_SEAT;
  return {
    access: named ? "preview-named-seat" : "preview",
    pass_kind: passKind,
    can_submit_claim: enrollmentCanSubmitClaim({ pass_kind: passKind }),
    attendee: {
      email: named ? "attendee@example.com" : "owner@example.com",
      name: named ? "Jordan Superintendent" : "Michael Contractor",
      company_name: named ? "Registered company" : "Contractor & Sons",
      attendee_names: named ? ["Jordan Superintendent"] : [],
      phone: null,
      preparation_notes: null,
      enrollment_type: named ? "individual" : "company",
      seats: named ? 1 : 2,
      ticket_number: named ? "ALP-A1B2C3D4" : "ALP-8F2A91C4",
      onboarding_completed_at: named ? "2026-09-03T10:00:00.000Z" : null,
    },
    claim: null,
    materials: {
      released: false,
      release_at: "2026-09-03T16:00:00.000Z",
      zoom_url: null,
      files: [],
    },
  };
}

const PORTAL_FUNCTION = "delay-intensive-portal";

async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(PORTAL_FUNCTION, { body });
  if (error) {
    let message = "The attendee portal could not complete that request.";
    try {
      const payload = await error.context?.json?.();
      if (payload?.error) message = payload.error;
    } catch {
      // Supabase may already have consumed the function response body.
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

function normalizePortalState(state: PortalState): PortalState {
  const pass_kind = state.pass_kind === "named_seat" ? "named_seat" : "purchaser";
  return {
    ...state,
    pass_kind,
    can_submit_claim: enrollmentCanSubmitClaim({
      pass_kind,
      can_submit_claim: state.can_submit_claim,
    }),
  };
}

export async function loadPortal(access?: string, sessionId?: string) {
  const state = await invoke<PortalState>({ action: "get", access, session_id: sessionId });
  return normalizePortalState(state);
}

export function saveOnboarding(access: string, input: {
  attendee_names: string[];
  company_name: string;
  phone: string;
  preparation_notes: string;
}) {
  return invoke<{ ok: true; onboarding_completed_at: string }>({
    action: "complete_onboarding",
    access,
    ...input,
  });
}

export async function uploadClaimFile(access: string, file: File): Promise<ClaimAttachment> {
  const request = await invoke<{
    path: string;
    token: string;
    attachment: ClaimAttachment;
  }>({
    action: "create_upload",
    access,
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
  });
  const { error } = await supabase.storage
    .from("intensive-claim-files")
    .uploadToSignedUrl(request.path, request.token, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Could not upload ${file.name}. ${error.message}`);
  return request.attachment;
}

export function submitPortalClaim(access: string, input: Record<string, unknown>) {
  return invoke<{ ok: true; claim: { id: string; created_at: string } }>({
    action: "submit_claim",
    access,
    ...input,
  });
}
