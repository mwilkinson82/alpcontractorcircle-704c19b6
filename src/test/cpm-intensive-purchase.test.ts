import { describe, expect, it } from "vitest";
import { CPM_MEMBER_PAYMENT_LINK_ID, CPM_PAYMENT_LINK_ID, paidCpmPurchase, paymentBlockReason, releasedAt, validAccessToken, validSessionId } from "../../supabase/functions/cpm-intensive-portal/validation";
const paidSession = () => ({
  id:"cs_live_"+"a".repeat(32), payment_link:CPM_PAYMENT_LINK_ID, payment_intent:"pi_example",
  livemode:true, mode:"payment", status:"complete", payment_status:"paid", currency:"usd", amount_subtotal:199700, amount_total:199700,
  customer_details:{email:"attendee@example.com"},
});
const memberSession = () => ({...paidSession(), payment_link:CPM_MEMBER_PAYMENT_LINK_ID, amount_subtotal:149700, amount_total:149700});
describe("CPM signed-webhook purchase gate",()=>{
  it("accepts the exact paid live CPM seat",()=>{expect(paidCpmPurchase(paidSession())).toBe(true);});
  it("accepts the member seat at its own price",()=>{expect(paidCpmPurchase(memberSession())).toBe(true);});
  it("rejects a seat priced for the other audience",()=>{
    expect(paidCpmPurchase({...paidSession(),amount_subtotal:149700,amount_total:149700})).toBe(false);
    expect(paidCpmPurchase({...memberSession(),amount_subtotal:199700,amount_total:199700})).toBe(false);
  });
  it.each([['payment_status','unpaid'],['status','open'],['livemode',false],['mode','subscription'],['currency','eur'],['amount_total',1],['payment_link','plink_delay'],['amount_subtotal',399400]])("rejects invalid %s",(key,value)=>{expect(paidCpmPurchase({...paidSession(),[key]:value})).toBe(false);});
  it.each([['payment_link','plink_delay'],['amount_subtotal',1]])("rejects invalid member %s",(key,value)=>{expect(paidCpmPurchase({...memberSession(),[key]:value})).toBe(false);});
  it("fails closed without a payment intent, attendee identity or real session ID",()=>{
    for(const patch of [{payment_intent:null},{customer_details:null},{id:"{CHECKOUT_SESSION_ID}"}]) expect(paidCpmPurchase({...paidSession(),...patch})).toBe(false);
    expect(paidCpmPurchase(null)).toBe(false);
  });
  it("treats partial refunds and disputes as blocks without inventing refund terms",()=>{
    expect(paymentBlockReason("charge.refunded",{refunded:false,amount_refunded:100})).toBe("refunded");
    expect(paymentBlockReason("charge.refunded",{refunded:true})).toBe("refunded");
    expect(paymentBlockReason("charge.dispute.created",{})).toBe("disputed");
    expect(paymentBlockReason("charge.updated",{refunded:true})).toBeNull();
  });
  it("locks materials until a valid release time has passed",()=>{
    expect(releasedAt(null)).toBe(false);expect(releasedAt("not a date")).toBe(false);
    expect(releasedAt("2026-09-25T14:00:00Z",Date.parse("2026-09-25T13:59:59Z"))).toBe(false);
    expect(releasedAt("2026-09-25T14:00:00Z",Date.parse("2026-09-25T14:00:00Z"))).toBe(true);
  });
  it("rejects malformed or test credentials before lookup",()=>{
    expect(validSessionId("{CHECKOUT_SESSION_ID}")).toBe(false);expect(validSessionId("cs_test_"+"a".repeat(32))).toBe(false);
    expect(validSessionId("cs_live_"+"a".repeat(32))).toBe(true);expect(validAccessToken("preview")).toBe(false);expect(validAccessToken("a".repeat(64))).toBe(true);
  });
});
