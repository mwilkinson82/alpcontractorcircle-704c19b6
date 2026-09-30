// Offline integration: real signature verifier, dispatcher, enrollment, mail payload,
// and portal handlers. All Stripe events, database rows, keys and fetches are synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { webcrypto, createHmac } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const copy=x=>JSON.parse(JSON.stringify(x));
const ids=['plink_1UBOioJdDAUSVXbNw0nBuTMh','plink_1UBOiqJdDAUSVXbNnZaiIeFf','plink_1UBOiyJdDAUSVXbNxbJsnSJ7','plink_1UBOiuJdDAUSVXbNulbGSceG','plink_1UBOjGJdDAUSVXbNt4u5wMHJ','plink_1UBOjHJdDAUSVXbNY01Rra5m','plink_1UBOjIJdDAUSVXbNAOlmW5yY','plink_1UBOjJJdDAUSVXbNCcWckNyO'];
const event=(link=ids[0])=>({id:'evt_synthetic',livemode:true,type:'checkout.session.completed',data:{object:{id:'cs_live_'+ 'a'.repeat(30),payment_link:link,payment_intent:'pi_synthetic',customer:'cus_synthetic',livemode:true,mode:'payment',status:'complete',payment_status:'paid',amount_subtotal:250000,amount_total:234567,currency:'usd',customer_details:{email:' Jordan@Example.com ',name:'Jordan Example'},custom_fields:[{key:'company',text:{value:'Example Construction'}}]}}});
function harness(extraEnv={}) {
 const env={SUPABASE_URL:'https://synthetic.invalid',SUPABASE_SERVICE_ROLE_KEY:'synthetic',STRIPE_INTENSIVE_WEBHOOK_SECRET:'synthetic-secret',RESEND_API_KEY:'synthetic',LOVABLE_API_KEY:'synthetic',OCTOBER_DELAY_FULFILLMENT_ENABLED:'true',...extraEnv};
 const tables={intensive_enrollments:[],intensive_email_events:[],cpm_intensive_enrollments:[],cpm_intensive_email_events:[],cpm_intensive_payment_blocks:[],cpm_intensive_settings:[{id:1,dates_label:'September 25–26, 2026',marshall_personal_welcome_auto:false}],intensive_claim_submissions:[],intensive_materials:[]};
 const sent=[],writes=[],reads=[];let sequence=0,handler;let failTable=null;
 let raceRelease;const raceGate=new Promise(resolve=>{raceRelease=resolve;});
 const db={storage:{from(){return {async createSignedUrl(p){return {data:{signedUrl:'https://synthetic.invalid/'+p}}}}}},from(table){
  let mode='select',values,options={},filters=[],wantRows=false,single=false;
  const q={select(){wantRows=true;return q;},eq(k,v){filters.push(r=>r[k]===v);return q;},in(k,v){filters.push(r=>v.includes(r[k]));return q;},order(){return q;},update(v){mode='update';values=v;return q;},insert(v){mode='insert';values=v;return q;},upsert(v,o){mode='upsert';values=v;options=o;return q;},maybeSingle(){single=true;return q;},single(){single=true;return q;},then(resolve,reject){return Promise.resolve().then(()=>{
   if(table===failTable) return {data:null,error:{message:'Synthetic storage failure'}};
   const rows=tables[table] ||= [];let result=rows.filter(r=>filters.every(f=>f(r)));
   if(mode==='select') reads.push(table);
   if(mode==='insert'||mode==='upsert') {
    const keys=options.onConflict?.split(',')||(table.endsWith('email_events')?['enrollment_id','email_kind']:table.endsWith('enrollments')?['stripe_checkout_session_id']:['id']);
    const existing=rows.find(r=>keys.every(k=>r[k]===values[k]));
    if(existing && mode==='insert') return {data:null,error:{code:'23505'}};
    if(existing) {if(!options.ignoreDuplicates)Object.assign(existing,values);result=[existing];}
    else {const row={id:'synthetic-'+(++sequence),created_at:new Date().toISOString(),...copy(values)};rows.push(row);result=[row];}
    writes.push({table,mode,values:copy(values)});
   } else if(mode==='update') {result.forEach(r=>Object.assign(r,values));writes.push({table,mode,values:copy(values)});}
   return {data:wantRows?copy(single?result[0]||null:result):null,error:null};
  }).then(resolve,reject);}};return q;
 }};
 const ctx=vm.createContext({Intl,Date,URL,Request,Response,TextEncoder,crypto:webcrypto,console:{log(){},error(){}},createClient:()=>db,Deno:{env:{get:k=>env[k]},serve:fn=>{handler=fn}},fetch:async(url,init)=>{
  assert.equal(url,'https://connector-gateway.lovable.dev/resend/emails');sent.push({headers:copy(init.headers),body:JSON.parse(init.body)});
  if(extraEnv.SYNTHETIC_CONCURRENT_SEND){if(sent.length===2)raceRelease();await raceGate;}
  return new Response(JSON.stringify({id:'synthetic-message-'+sent.length}),{status:200});
 }});
 const load=file=>vm.runInContext(stripTypeScriptTypes(fs.readFileSync(path.join(root,file),'utf8').replace(/^import[\s\S]*?;\r?\n/gm,'').replace(/^export /gm,'')),ctx,{filename:file});
 for(const file of ['confirmation-email-frame','delay-confirmation-cohort','october-delay-fulfillment','october-delay-portal','intensive','cpm-intensive-validation','cpm-intensive','cpm-intensive-email','cpm-marshall-personal-welcome'])load('supabase/functions/_shared/'+file+'.ts');
 load('supabase/functions/delay-intensive-webhook/index.ts');const webhook=handler;
 load('supabase/functions/delay-intensive-portal/index.ts');const portal=handler;
 return {ctx,env,tables,sent,writes,reads,fail(table){failTable=table;},async checkout(e,valid=true){const body=JSON.stringify(e),t=Math.floor(Date.now()/1000),sig=createHmac('sha256',env.STRIPE_INTENSIVE_WEBHOOK_SECRET).update(`${t}.${body}`).digest('hex');const res=await webhook(new Request('https://synthetic.invalid/webhook',{method:'POST',headers:{'stripe-signature':`t=${t},v1=${valid?sig:'invalid'}`},body}));return {status:res.status,body:await res.json()};},async portal(body){const res=await portal(new Request('https://synthetic.invalid/portal',{method:'POST',body:JSON.stringify(body)}));return {status:res.status,body:await res.json()};}};
}
let checks=0;
for(const [i,id] of ids.entries()) {
 const h=harness(),e=event(id),r=await h.checkout(e);assert.equal(r.status,200);assert.equal(r.body.result.cohort,'delay-2026-10');
 const row=h.tables.intensive_enrollments[0];assert.equal(row.seats,[1,3,5,7].includes(i)?2:1);assert.equal(row.enrollment_type,row.seats===2?'company':'individual');assert.equal(row.audience_channel,[2,3,6,7].includes(i)?'contractor_circle':'public');assert.equal(row.materials_release_at,'infinity');assert.equal(row.amount_total,234567);assert.equal(row.purchaser_email,'jordan@example.com');assert.match(row.access_token,/^[a-f0-9]{64}$/);
 const mail=h.sent[0].body;assert.equal(mail.from,'ALP Intensive <intensive@alpcontractorcircle.com>');assert.deepEqual(mail.to,['jordan@example.com']);assert.equal(mail.reply_to,'marshall@marshallwilkinson.com');assert.equal(mail.subject,'Your ALP Intensive e-ticket + attendee portal');assert.match(mail.html,/October 16–18, 2026/);assert.match(mail.html,/\$2,345.67/);assert.ok(mail.html.includes('?access='+row.access_token));assert.ok(!mail.html.includes('September'));assert.ok(!mail.html.includes('meet.google.com'));
 const token=row.access_token;await h.checkout(e);assert.equal(h.sent.length,1);assert.equal(h.tables.intensive_enrollments.length,1);assert.equal(row.access_token,token);
 const p=await h.portal({session_id:e.data.object.id,action:'get'});assert.equal(p.status,200);assert.equal(p.body.cohort.id,'delay-2026-10');assert.equal(p.body.cohort.sessions.length,3);assert.equal(p.body.materials.released,false);assert.equal(p.body.materials.release_at,null);assert.deepEqual(p.body.materials.files,[]);assert.equal(p.body.materials.zoom_url,null);assert.ok(p.body.cohort.sessions.every(s=>s.room_url===null&&s.room_status==='pending'));
 assert.equal((await h.portal({access:token,action:'get'})).status,200);
 assert.equal((await h.portal({access:token,action:'complete_onboarding',attendee_names:row.seats===2?['Jordan Example','Taylor Example']:['Jordan Example'],company_name:'Example Construction'})).status,200);
 assert.ok(!h.writes.some(w=>w.table.startsWith('cpm_')));checks++;
}
for(const patch of [{payment_status:'unpaid'},{livemode:false},{mode:'subscription'},{status:'open'}]) {const h=harness(),e=event();Object.assign(e.data.object,patch);await h.checkout(e);assert.equal(h.writes.length,0);assert.equal(h.sent.length,0);checks++;}
for(const patch of [{id:null},{id:'cs_test_invalid'},{payment_intent:null},{customer_details:{email:''}},{amount_total:-1},{currency:'not-a-currency'}]) {const h=harness(),e=event();Object.assign(e.data.object,patch);assert.equal((await h.checkout(e)).status,500);assert.equal(h.writes.length,0);checks++;}
{
 const h=harness(),e=event();e.livemode=false;await h.checkout(e);assert.equal(h.writes.length,0);
 const bad=await h.checkout(event(),false);assert.equal(bad.status,400);assert.equal(h.writes.length,0);checks+=2;
}
for(const flag of [undefined,'false','TRUE']) {const h=harness({OCTOBER_DELAY_FULFILLMENT_ENABLED:flag});assert.equal((await h.checkout(event())).status,500);assert.equal(h.writes.length,0);assert.equal(h.sent.length,0);checks++;}
for(const id of ['plink_unknown','evergreen-synthetic']) {const h=harness();await h.checkout(event(id));assert.equal(h.sent.length,0);assert.equal(h.writes.length,0);checks++;}
{
 const h=harness();const e=event();e.type='checkout.session.async_payment_succeeded';e.data.object.payment_link={id:ids[0]};e.data.object.payment_intent={id:'pi_synthetic'};assert.equal((await h.checkout(e)).status,200);assert.equal(h.sent.length,1);checks++;
}
for(const id of ['plink_1U7n37JdDAUSVXbNG7XStxnN','plink_1U7n39JdDAUSVXbNIreq7bTB']) {const h=harness();await h.checkout(event(id));assert.equal(h.sent.length,1);assert.ok(h.sent[0].body.html.includes('September'));assert.ok(!h.sent[0].body.html.includes('October'));checks++;}
{
 const h=harness(),e=event('plink_1UFijSJdDAUSVXbNu3vdGChq');e.data.object.amount_subtotal=199700;e.data.object.amount_total=199700;await h.checkout(e);assert.equal(h.tables.intensive_enrollments.length,0);assert.equal(h.tables.cpm_intensive_enrollments.length,1);assert.equal(h.sent.length,1);assert.ok(!h.sent[0].body.html.includes('October'));assert.ok(!h.tables.cpm_intensive_email_events.some(x=>x.email_kind==='marshall_personal_welcome'));checks++;
}
{
 const h=harness();h.tables.cpm_intensive_payment_blocks.push({stripe_payment_intent_id:'pi_synthetic',reason:'refunded'});await h.checkout(event());assert.equal(h.sent.length,0);assert.equal(h.tables.intensive_enrollments.length,0);checks++;
}
{
 const h=harness();await h.checkout(event());h.tables.intensive_enrollments[0].payment_status='revoked';await h.checkout(event());assert.equal(h.sent.length,1);assert.equal(h.tables.intensive_enrollments[0].payment_status,'revoked');assert.equal((await h.portal({access:h.tables.intensive_enrollments[0].access_token})).status,401);checks++;
}
{
 const h=harness();h.fail('intensive_enrollments');assert.equal((await h.checkout(event())).status,500);assert.equal(h.sent.length,0);checks++;
}
{
 const h=harness({INTENSIVE_ZOOM_URL:'https://synthetic.invalid/legacy-room'});h.tables.intensive_materials.push({id:'legacy',is_published:true,storage_path:'legacy.pdf'});await h.checkout(event());const p=await h.portal({access:h.tables.intensive_enrollments[0].access_token});assert.equal(p.body.materials.zoom_url,null);assert.deepEqual(p.body.materials.files,[]);assert.ok(!h.reads.includes('intensive_materials'));checks++;
 const config=h.ctx.octoberDelayPortalConfig(()=>undefined,new Date('2026-10-16T17:00:00Z'));assert.equal(config.releaseAt,null);assert.equal(config.materialsReleased,false);
 const settings={OCTOBER_DELAY_ROOM_URLS:JSON.stringify({'2026-10-16':'https://meet.google.com/aaa-bbbb-ccc'}),OCTOBER_DELAY_MATERIALS_RELEASE_AT:'2026-10-14T16:00:00Z',OCTOBER_DELAY_MATERIAL_IDS:'11111111-1111-1111-1111-111111111111'};
 const at=time=>h.ctx.octoberDelayPortalConfig(k=>settings[k],new Date(time));
 assert.equal(at('2026-10-16T15:59:59Z').sessions[0].room_url,null);assert.ok(at('2026-10-16T16:00:00Z').sessions[0].room_url);assert.equal(at('2026-10-16T21:00:01Z').sessions[0].room_url,null);assert.equal(at('2026-10-13T17:00:00Z').materialsReleased,false);assert.equal(at('2026-10-16T17:00:00Z').materialsReleased,true);checks++;
}
for (const [type,status] of [['charge.refunded','refunded'],['charge.dispute.created','disputed']]) {
 for(const before of [true,false]) {
  const h=harness();if(!before)await h.checkout(event());
  const revocation={id:'evt_synthetic_revocation',livemode:true,type,data:{object:{payment_intent:'pi_synthetic',refunded:true}}};
  assert.equal((await h.checkout(revocation)).status,200);await h.checkout(event());
  assert.equal(h.sent.length,before?0:1);assert.equal(h.tables.intensive_enrollments.length,before?0:1);
  if(!before){assert.equal(h.tables.intensive_enrollments[0].payment_status,status);assert.equal((await h.portal({access:h.tables.intensive_enrollments[0].access_token})).status,401);}
  checks++;
 }
}
// Characterize the pre-existing mailer race rather than silently claiming exactly-once.
{
 const h=harness({SYNTHETIC_CONCURRENT_SEND:true});await Promise.all([h.checkout(event()),h.checkout(event())]);assert.equal(h.tables.intensive_enrollments.length,1);assert.equal(h.sent.length,2);
 console.log('KNOWN RELEASE GATE: concurrent delivery reproduces 2 provider requests in the existing mailer (sequential retries deduplicate). No live sends occurred.');
}
console.log(`PASS: ${checks} offline checkout/portal scenarios; signature, eight offers, paid-only gates, payloads, sequential dedup, legacy/CPM isolation, default-off release switch, access tokens and pending resources.`);
