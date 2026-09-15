import { describe, expect, it } from "vitest";
import { CPM_OFFER, CPM_PAYMENT_LINK_ID, CPM_PRICE_ID, CPM_PRODUCT_ID, PRODUCT_MAP, catalogOffer, paidCpmPurchase, paymentBlockReason, releasedAt, validAccessToken, validSessionId } from "../../supabase/functions/cpm-intensive-portal/validation";
const paidSession = () => ({
  id:"cs_live_"+"a".repeat(32), payment_link:CPM_PAYMENT_LINK_ID, payment_intent:"pi_example",
  livemode:true, mode:"payment", status:"complete", payment_status:"paid", currency:"usd", amount_subtotal:199700, amount_total:199700,
  customer_details:{email:"attendee@example.com"},
});
const intensiveItems = { data: [{ price: { id: CPM_PRICE_ID, product: CPM_PRODUCT_ID }, amount_subtotal: 199700, quantity: 1 }] };
const customItems = { data: [{ price: { id: "price_custom", product: "prod_CustomAmount" }, amount_subtotal: 199700, quantity: 1 }] };
describe("CPM signed-webhook purchase gate",()=>{
  it("maps the live product and price IDs to CPM intensive, not Custom",()=>{
    expect(PRODUCT_MAP[CPM_PRODUCT_ID]).toBe(CPM_OFFER);
    expect(PRODUCT_MAP[CPM_PRICE_ID]).toBe(CPM_OFFER);
    expect(catalogOffer({ line_items: intensiveItems })).toBe(CPM_OFFER);
    expect(catalogOffer({ line_items: customItems })).toBe("unmapped");
    expect(Object.values(PRODUCT_MAP).every(offer => offer === CPM_OFFER)).toBe(true);
  });
  it("accepts the exact paid live CPM seat",()=>{expect(paidCpmPurchase(paidSession())).toBe(true);});
  it("accepts the same catalog IDs when line items are expanded and the payment link is omitted",()=>{
    expect(paidCpmPurchase({...paidSession(), payment_link:null, line_items:intensiveItems})).toBe(true);
  });
  it("rejects Custom or other catalog line items even on the CPM payment link",()=>{
    expect(paidCpmPurchase({...paidSession(), line_items:customItems})).toBe(false);
  });
  it.each([['payment_status','unpaid'],['status','open'],['livemode',false],['mode','subscription'],['currency','eur'],['amount_total',1],['payment_link','plink_delay'],['amount_subtotal',399400]])("rejects invalid %s",(key,value)=>{expect(paidCpmPurchase({...paidSession(),[key]:value})).toBe(false);});
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
