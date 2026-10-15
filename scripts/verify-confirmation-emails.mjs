// Offline regression + synthetic previews. Node 24+. No credentials, network, or sends.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '6c5cd51bdf52e018472720848484a3f430267e55';
const shared = 'supabase/functions/_shared/';
const git = (...args) => execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, ...args], { cwd: root, encoding: 'utf8' }).replaceAll('\r\n', '\n');
const source = (file, original = false) => original ? git('show', `${base}:${shared}${file}`) : fs.readFileSync(path.join(root, shared, file), 'utf8');
function load(original = false) {
  const context = vm.createContext({ Intl, TextEncoder, URL, console, createClient() { throw Error('Database forbidden'); }, fetch() { throw Error('Network forbidden'); }, Deno: { env: { get() { throw Error('Credentials forbidden'); } } } });
  for (const file of [...(original ? [] : ['confirmation-email-frame.ts', 'delay-confirmation-cohort.ts']), 'intensive.ts', 'cpm-intensive-email.ts']) {
    const code = source(file, original).replace(/^import .*;\r?\n/gm, '').replace(/^export /gm, '');
    vm.runInContext(stripTypeScriptTypes(code), context);
  }
  return context;
}
const old = load(true), current = load();
const sample = {
  id: '12345678-1234-1234-1234-123456789012', purchaser_name: 'Jordan Example',
  purchaser_email: 'jordan@example.com', company_name: 'Example Construction',
  stripe_checkout_session_id: 'cs_synthetic_ABCD1234', access_token: 'synthetic-preview-not-a-valid-access-token',
  enrollment_type: 'individual', seats: 1, amount_total: 123456, currency: 'usd', payment_status: 'paid',
};
const textChunks = html => [...html.matchAll(/>([^<>]+)</g)].map(m => m[1].trim()).filter(Boolean);
const links = html => [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
let cases = 0;
function compare(fn, args) {
  const before = old[fn](...args), after = current[fn](...args);
  assert.equal(after.subject, before.subject);
  assert.deepEqual(links(after.html), links(before.html));
  for (const text of textChunks(before.html)) {
    if (['ALP Delay & Damages Intensive', 'ALP', 'PROFESSIONAL INTENSIVE', 'Enrollment confirmed'].includes(text)) continue;
    assert.ok(after.html.includes(text), `${fn}: missing original text: ${text}`);
  }
  assert.equal((after.html.match(/<h1\b/g) || []).length, 1);
  assert.match(after.html, /max-width:600px/);
  assert.match(after.html, /\[if mso\]/);
  assert.match(after.html, /<html lang="en" dir="ltr">/);
  assert.ok(!after.html.includes('Carmelo'));
  cases++;
  return after.html;
}
for (const name of ['Jordan Example', '<script>alert(1)</script> Example', null, '']) {
  for (const [amount, currency] of [[123456, 'usd'], [0, 'usd'], [987654, 'eur'], [null, null]]) {
    for (const pass of [{ seats: 1 }, { seats: 2, enrollment_type: 'company' }, { seats: 14 }, { seats: 1, pass_kind: 'named_seat' }, { seats: 1, can_submit_claim: false }]) {
      const row = { ...sample, ...pass, purchaser_name: name, amount_total: amount, currency };
      compare('onboardingEmail', [row]);
      if (pass.pass_kind || pass.can_submit_claim === false) assert.ok(!current.onboardingEmail(row).html.includes('submit a live claim candidate'));
    }
  }
  for (const dates of [null, '', 'Example dates <pending> & subject to confirmation']) compare('cpmWelcomeEmail', [{ ...sample, purchaser_name: name }, dates]);
}
for (const kind of ['seven_day','onboarding_reminder_1','onboarding_reminder_2','onboarding_reminder_3','forty_eight_hour','materials_release','event_day_one']) {
  assert.equal(JSON.stringify(current.reminderEmail(sample, kind)), JSON.stringify(old.reminderEmail(sample, kind)));
}
assert.equal(JSON.stringify(current.claimReceiptEmail('Jordan', 'Synthetic project')), JSON.stringify(old.claimReceiptEmail('Jordan', 'Synthetic project')));
// Protect legacy code outside approved presentation and cohort-only claim date changes.
const normalize = (text, fn) => text.replaceAll('\r\n','\n').replace(/^import .*\n/gm,'').replace('  stripe_payment_link_id?: string | null;\n','').replace(new RegExp(`export function ${fn}[\\s\\S]*?\\n}`), '');
const normalizeDelay = text => normalize(text, 'onboardingEmail')
  .replace(/export function claimReceiptEmail[\s\S]*?\n}/, '')
  .replace(',payment_status,stripe_payment_link_id)', ',payment_status)')
  .replace(', Boolean(delayConfirmationCohort(enrollment.stripe_payment_link_id))', '');
assert.equal(normalizeDelay(source('intensive.ts')), normalizeDelay(source('intensive.ts',true)));
assert.ok(current.claimReceiptEmail('Jordan','Synthetic project',true).html.includes('October 16\u201318'));
assert.ok(!current.claimReceiptEmail('Jordan','Synthetic project',true).html.includes('September'));
assert.equal(normalize(source('cpm-intensive-email.ts'), 'cpmWelcomeEmail'), normalize(source('cpm-intensive-email.ts',true), 'cpmWelcomeEmail'));
for (const file of [shared+'cpm-marshall-personal-welcome.ts', shared+'cpm-intensive.ts']) {
  assert.equal(fs.readFileSync(path.join(root,file),'utf8').replaceAll('\r\n','\n'),git('show',`${base}:${file}`));
}
const out = path.join(root, 'artifacts/confirmation-emails');
fs.mkdirSync(out, {recursive:true});
const octoberIds = [
  'plink_1UBOioJdDAUSVXbNw0nBuTMh', 'plink_1UBOiqJdDAUSVXbNnZaiIeFf',
  'plink_1UBOiyJdDAUSVXbNxbJsnSJ7', 'plink_1UBOiuJdDAUSVXbNulbGSceG',
  'plink_1UBOjGJdDAUSVXbNt4u5wMHJ', 'plink_1UBOjHJdDAUSVXbNY01Rra5m',
  'plink_1UBOjIJdDAUSVXbNAOlmW5yY', 'plink_1UBOjJJdDAUSVXbNCcWckNyO',
];
for (const id of octoberIds) {
  for (const pass of [{}, {pass_kind:'named_seat'}, {can_submit_claim:false}]) {
    const row={...sample,...pass,stripe_payment_link_id:id};
    const result=current.onboardingEmail(row), before=old.onboardingEmail(row);
    assert.equal(result.subject,before.subject);
    assert.deepEqual(links(result.html),links(before.html));
    for (const phrase of ['October 16–18, 2026','Friday, October 16 · 1:00–5:00 p.m. ET','Saturday, October 17 · 9:00 a.m.–5:00 p.m. ET','Sunday, October 18 · 10:00 a.m.–1:00 p.m. ET','October materials and live-room access details are pending confirmation.','$1,234.56','ALP-ABCD1234']) assert.ok(result.html.includes(phrase),phrase);
    assert.ok(!/September|October 15|Live via Zoom|meet\.google\.com/.test(result.html));
    if (pass.pass_kind || pass.can_submit_claim===false) assert.ok(!result.html.includes('submit a live claim candidate'));
    cases++;
  }
}
for (const id of [undefined,null,'','unknown','evergreen-synthetic','plink_1U7n37JdDAUSVXbNG7XStxnN','plink_1U7n39JdDAUSVXbNIreq7bTB','plink_1UFijSJdDAUSVXbNu3vdGChq']) {
  // No date or amount heuristics may assign October to unknown/evergreen/legacy/CPM offers.
  const row={...sample,stripe_payment_link_id:id,created_at:'2026-10-01T00:00:00Z'};
  assert.ok(!current.onboardingEmail(row).html.includes('October'));
  compare('onboardingEmail',[row]);
}
assert.ok(!current.cpmWelcomeEmail(sample,null).html.includes('October'));
const octoberSample={...sample,stripe_payment_link_id:octoberIds[0]};
for (const [name, fn, args] of [
  ['delay-october', 'onboardingEmail', [octoberSample]],
  ['delay', 'onboardingEmail', [sample]],
  ['delay-company', 'onboardingEmail', [{...sample, enrollment_type:'company', seats:2, amount_total:234567}]],
  ['delay-named-seat', 'onboardingEmail', [{...sample,pass_kind:'named_seat',amount_total:null}]],
  ['cpm', 'cpmWelcomeEmail', [sample,'Example cohort dates — preview only']],
  ['cpm-fallback', 'cpmWelcomeEmail', [sample,null]],
]) fs.writeFileSync(path.join(out,name+'.html'),current[fn](...args).html);
console.log(`PASS: ${cases} confirmation cases; verified October copy only for eight mapped offers; preserved legacy/CPM content, subjects, hrefs, reminder/claim output, and unchanged legacy delivery and personal-queue logic. Six synthetic HTML previews written to ${out}`);
