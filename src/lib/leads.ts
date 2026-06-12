// Lead capture adapter.
// MVP: queues to localStorage so the form is functional immediately.
// When Lovable Cloud is enabled, swap `captureLead` to insert into
// public.leads + upsert public.email_subscribers (respecting suppression).

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

export interface StoredLead extends LeadInput {
  id: string;
  created_at: string;
}

const KEY = "alp_leads_queue_v1";

function readQueue(): StoredLead[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredLead[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(rows: StoredLead[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export async function captureLead(input: LeadInput): Promise<StoredLead> {
  const email = input.email.trim().toLowerCase();
  const first_name = input.first_name.trim();

  if (!first_name) throw new Error("First name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");

  const row: StoredLead = {
    id: crypto.randomUUID(),
    first_name,
    email,
    source: input.source,
    created_at: new Date().toISOString(),
  };

  const q = readQueue();
  q.push(row);
  writeQueue(q);

  // Future: await supabase.from('leads').insert(row);
  //         await supabase.from('email_subscribers').upsert({...}, { onConflict: 'email' });
  return row;
}

export function getQueuedLeads(): StoredLead[] {
  return readQueue();
}
