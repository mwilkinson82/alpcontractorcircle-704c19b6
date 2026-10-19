import { AthenaLayout, R } from "./AthenaLayout";

const sections: [string, string][] = [
  ["What Athena is", "Athena is a project-controls assistant for specialty contractors' office teams. It helps you set up jobs from contracts, track notice windows and open items, and prepare client-safe reports and draft notices."],
  ["Athena drafts; you decide and send", "Athena doesn't give legal, accounting or engineering advice, and it doesn't send anything for you. Contract summaries, deadlines and drafts are aids. Check them against your actual contract documents, and get professional advice where you need it. You're responsible for the notices you send and the decisions you make."],
  ["Your account", "Keep your sign-in secure, and only add people to your workspace who should see your jobs. You're responsible for activity in your workspace."],
  ["Your data", "You own the information you put into Athena. You give me permission to store and process it only to run Athena for you, as described in the Privacy Policy (/athena/privacy). Don't upload information you don't have the right to share."],
  ["Acceptable use", "Don't misuse Athena: no unlawful use, no attempts to get into other workspaces, no interfering with the service, and no entering passwords, card numbers, Social Security numbers or health information."],
  ["Access and fees", "[NEEDS MARSHALL: how access is granted (e.g. included with an existing ALP membership) — no prices or checkout links on this page.]"],
  ["Availability and changes", "I work to keep Athena available and accurate, but it's provided \"as is\" without warranties to the extent the law allows. I may update or change features, and I may suspend access that breaks these terms."],
  ["Limitation of liability", "[NEEDS MARSHALL: liability cap language, reviewed by counsel.]"],
  ["Ending use", "You can stop using Athena and disconnect it at any time. [NEEDS MARSHALL: what happens to data on termination — tie to retention.]"],
  ["Governing law", "[NEEDS MARSHALL: governing state/country.]"],
  ["Contact", "[NEEDS MARSHALL: contact email] · /athena/support"],
];

const AthenaTerms = () => (
  <AthenaLayout legal title="Athena by ALP — Terms of Service" description="Terms of Service for Athena by ALP.">
    <h1>Athena by ALP — Terms of Service</h1>
    <hr className="athena-accent" />
    <p className="athena-meta"><R>{"Last updated: [NEEDS MARSHALL: effective date]"}</R></p>
    <p><R>{"These terms are between you and [NEEDS MARSHALL: legal entity name] (\"I\", \"me\"), the publisher of Athena by ALP. By using Athena you agree to them."}</R></p>
    {sections.map(([h, b]) => (
      <section key={h}>
        <h2>{h}</h2>
        <p><R>{b}</R></p>
      </section>
    ))}
  </AthenaLayout>
);

export default AthenaTerms;
