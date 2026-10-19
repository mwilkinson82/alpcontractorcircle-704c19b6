import { AthenaLayout, List, R } from "./AthenaLayout";

const AthenaPrivacy = () => (
  <AthenaLayout legal title="Athena by ALP — Privacy Policy" description="Privacy Policy for Athena by ALP.">
    <h1>Athena by ALP — Privacy Policy</h1>
    <hr className="athena-accent" />
    <p className="athena-meta"><R>{"Last updated: [NEEDS MARSHALL: effective date]"}</R></p>
    <p>I'm Marshall Wilkinson. I built Athena by ALP for the office side of specialty contractors: owners, project managers, contracts, estimating and accounting. This policy explains what I collect when you use Athena, why, who receives it, how long I keep it, and what you control.</p>
    <p><R>{"Publisher: [NEEDS MARSHALL: legal entity name exactly as verified with OpenAI, e.g. \"ALP ___ LLC\"], [NEEDS MARSHALL: mailing address]."}</R></p>

    <h2>What I collect</h2>
    <List items={[
      "**Account details:** your name and email address, and the sign-in information needed to verify you. I never ask for or store your passwords for other services, API keys, MFA codes, Social Security numbers, payment card numbers or health information inside Athena.",
      "**Company profile:** company name, your company's role (for example subcontractor), work types, trades, the tools you use, decision rights and default settings you choose in onboarding.",
      "**Team members:** names, emails and roles (owner, PM, all access) of people you add to your workspace, and project-manager contact details you enter for a job.",
      "**Job information you provide:** job names and numbers, contract and subcontract text and terms you paste or upload, setup answers, delays, open items, the evidence you give to close them, and reports and draft notices Athena prepares.",
      "**Technical data:** basic logs needed to run and secure the service, such as request times and errors.",
    ]} />

    <h2>How I use it</h2>
    <List items={[
      "To run Athena: set up jobs, read contract terms, track notice deadlines and open items, and prepare reports and drafts for you.",
      "To keep your workspace secure and limited to the people you've allowed in.",
      "To fix problems and improve Athena.",
    ]} />
    <p>I don't sell your data, and I don't use it for advertising.</p>

    <h2>Who receives it</h2>
    <List items={[
      "**Your data lives in a secure Supabase database**, which hosts storage and sign-in for Athena.",
      "**ChatGPT / OpenAI:** when you use Athena inside ChatGPT, the requests you make and the results Athena returns pass through ChatGPT. OpenAI's own privacy policy covers how OpenAI handles that.",
      "**People in your workspace**, according to the roles you assign.",
      "[NEEDS MARSHALL: any other service providers, e.g. email delivery or hosting/CDN, confirm full list]",
      "Authorities, if the law requires it.",
    ]} />
    <p>Athena does not send email or messages for you, and does not connect to third-party systems such as Procore. It drafts; you send.</p>

    <h2>How long I keep it</h2>
    <p><R>{"[NEEDS MARSHALL: retention period for account data, job data and logs, and how long after account closure data is deleted.]"}</R></p>

    <h2>Your controls</h2>
    <List items={[
      "See and correct your company profile, team and job information through Athena.",
      "Disconnect Athena from ChatGPT at any time in ChatGPT's settings.",
      "Ask me for a copy of your data, or to delete your account and data, at [NEEDS MARSHALL: privacy contact email]. [NEEDS MARSHALL: response time commitment.]",
    ]} />

    <h2>Age</h2>
    <p>Athena is a business tool and is not meant for anyone under 13.</p>

    <h2>Changes</h2>
    <p>If I change this policy, I'll update the date above and post the new version here.</p>

    <h2>Contact</h2>
    <p><R>{"[NEEDS MARSHALL: privacy contact email] · Support: /athena/support"}</R></p>
  </AthenaLayout>
);

export default AthenaPrivacy;
