import { AthenaLayout, R } from "./AthenaLayout";

const faqs: [string, string][] = [
  ["How do I connect Athena in ChatGPT?", "Add Athena by ALP from the ChatGPT apps directory, sign in with your Athena account, and approve the permissions shown."],
  ["How do I disconnect it?", "Remove Athena in ChatGPT's settings at any time."],
  ["Does Athena send emails or notices for me?", "No. Athena drafts notices with a \"Sign as\" line; you review and send them yourself."],
  ["Does Athena connect to Procore or other systems?", "No. It works only with what you give it inside your Athena workspace."],
  ["How do I get my data or delete my account?", "Email the support address above. See the Privacy Policy: /athena/privacy."],
];

const AthenaSupport = () => (
  <AthenaLayout legal title="Athena by ALP — Support" description="Get help with Athena by ALP.">
    <h1>Athena by ALP — Support</h1>
    <hr className="athena-accent" />
    <p>Need help with Athena? Reach me directly.</p>
    <p><R>{"**Email:** [NEEDS MARSHALL: support email that reviewers and users can reach]"}</R></p>
    <p><R>{"**Response time:** [NEEDS MARSHALL: e.g. within 1–2 business days]"}</R></p>

    <h2>Common questions</h2>
    {faqs.map(([q, a]) => (
      <p key={q}><strong>{q}</strong> <R>{a}</R></p>
    ))}
    <p>When you write in, include your company name and the job number, and describe what you asked Athena and what happened. Please don't send passwords or payment information.</p>
    <p><R>{"Terms: /athena/terms"}</R></p>
  </AthenaLayout>
);

export default AthenaSupport;
