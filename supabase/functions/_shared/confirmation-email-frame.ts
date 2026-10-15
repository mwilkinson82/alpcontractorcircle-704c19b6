// Confirmation-only frame. Existing reminders and claim messages retain emailFrame.
// Callers supply already-escaped HTML, just as they do for the legacy frame.
export function confirmationEmailFrame(preheader: string, program: string, headline: string, body: string) {
  return `<!doctype html>
<html lang="en" dir="ltr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${program} — Enrollment confirmed</title>
<style>
body { margin:0 !important; padding:0 !important; }
table { border-collapse:collapse; }
@media only screen and (max-width:620px) {
  .outer { padding:20px 12px !important; }
  .pad { padding-left:26px !important; padding-right:26px !important; }
  .hero-title { font-size:42px !important; line-height:44px !important; letter-spacing:-2px !important; }
}
@media (prefers-color-scheme:dark) {
  body,.canvas { background-color:#12110F !important; }
  .paper { background-color:#F7F2EA !important; color:#1C1A17 !important; }
  .hero { background-color:#1C1A17 !important; color:#F7F2EA !important; }
  .light { color:#F7F2EA !important; }
  .orange { color:#F76A16 !important; }
}
</style></head>
<body style="margin:0;padding:0;background-color:#E9E3DA;color:#1C1A17;font-family:Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<div lang="en" dir="ltr" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">${preheader}</div>
<table lang="en" dir="ltr" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="canvas" style="background-color:#E9E3DA"><tr><td align="center" class="outer" style="padding:40px 20px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">
<tr><td style="height:7px;line-height:7px;font-size:0;background-color:#F76A16">&nbsp;</td></tr>
<tr><td class="hero pad" style="padding:35px 42px 39px;background-color:#1C1A17;color:#F7F2EA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="light" style="font-size:27px;line-height:30px;font-weight:900;letter-spacing:-1px;color:#F7F2EA">ALP<span class="orange" style="color:#F76A16">.</span></td><td align="right" class="light" style="font-size:10px;line-height:16px;font-weight:700;letter-spacing:1px;color:#F7F2EA">PROFESSIONAL<br>INTENSIVE</td></tr></table>
<p class="orange" style="margin:39px 0 13px;color:#F76A16;font-size:11px;line-height:17px;font-weight:700;letter-spacing:2px">ENROLLMENT CONFIRMED</p>
<h1 class="hero-title light" style="margin:0;color:#F7F2EA;font-size:56px;line-height:57px;font-weight:900;letter-spacing:-2.5px">${headline}</h1>
</td></tr>
<tr><td class="paper pad" style="padding:35px 42px 34px;background-color:#F7F2EA;color:#1C1A17">${body}</td></tr>
<tr><td class="hero" style="padding:22px 26px;background-color:#1C1A17;color:#F7F2EA;font-size:12px;line-height:1.7">
<p class="light" style="margin:0 0 12px;color:#F7F2EA;font-weight:700;letter-spacing:1px">${program}</p>
Questions or attendee changes: <a href="mailto:marshall@marshallwilkinson.com" class="light" style="color:#F7F2EA;text-decoration:underline">marshall@marshallwilkinson.com</a><br>Advanced professional education. Not legal advice or a project-specific engagement.
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}
