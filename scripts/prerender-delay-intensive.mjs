/**
 * Post-build: clone dist/index.html into dist/delay-intensive/index.html with
 * the Delay & Damages Intensive head fields, so crawlers (and curl) see the
 * correct title/description/canonical/og without executing JS.
 * Hashed asset tags from the built index are preserved verbatim.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = resolve(root, "dist/index.html");
const outDir = resolve(root, "dist/delay-intensive");

const SEO = {
  title: "Damage & Delay Intensive | ALP Contractor Circle — Oct 16–18 2026",
  description:
    "A live 3-day intensive for construction owners on delay, claims, and money — preserve entitlement, prove delay, quantify damages, assemble a defensible claim. October 16–18, 2026, live via Zoom. Early-attendee tuition through Sep 30: $2,500 individual / $3,500 company.",
  canonical: "https://alpcontractorcircle.com/delay-intensive",
  image: "https://alpcontractorcircle.com/og-delay-intensive.png",
};

const esc = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const replaceOrAppend = (html, pattern, replacement, appended) => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `  ${appended}\n</head>`);
};

const main = async () => {
  let html;
  try {
    html = await readFile(distIndex, "utf8");
  } catch {
    console.warn("[prerender] dist/index.html not found — skipping.");
    return;
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(SEO.title)}</title>`);

  const metas = [
    ['name', "description", SEO.description],
    ['property', "og:url", SEO.canonical],
    ['property', "og:title", SEO.title],
    ['property', "og:description", SEO.description],
    ['property', "og:image", SEO.image],
    ['name', "twitter:title", SEO.title],
    ['name', "twitter:description", SEO.description],
    ['name', "twitter:image", SEO.image],
  ];

  for (const [attr, key, value] of metas) {
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    const pattern = new RegExp(`<meta\\s+${attr}=["']${key}["'][^>]*>`, "i");
    html = replaceOrAppend(html, pattern, tag, tag);
  }

  const canonicalTag = `<link rel="canonical" href="${SEO.canonical}" />`;
  html = replaceOrAppend(html, /<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag, canonicalTag);

  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "index.html"), html, "utf8");
  console.log("[prerender] wrote dist/delay-intensive/index.html");
};

await main();
