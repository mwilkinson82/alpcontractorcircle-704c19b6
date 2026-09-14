/**
 * Post-build: clone dist/index.html into dist/cpm-intensive/index.html with the
 * CPM Schedule Intensive head fields, so crawlers (and curl) see the correct
 * title/description/canonical/og without executing JS.
 * Hashed asset tags from the built index are preserved verbatim.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = resolve(root, "dist/index.html");
const outDir = resolve(root, "dist/cpm-intensive");

const SEO = {
  title: "ALP CPM Schedule Intensive (2-Day) | ALP Contractor Circle",
  description:
    "Master CPM scheduling in Primavera P6 with Marshall Wilkinson. Build your own baseline, run reliable updates, analyze delay and establish the time record for extensions and delay damages. Two live days. $1,997 USD per seat.",
  canonical: "https://alpcontractorcircle.com/cpm-intensive",
  image: "https://alpcontractorcircle.com/og-contractor-circle.png",
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
    console.warn("[prerender:cpm] dist/index.html not found — skipping.");
    return;
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(SEO.title)}</title>`);

  const metas = [
    ["name", "description", SEO.description],
    ["property", "og:url", SEO.canonical],
    ["property", "og:title", SEO.title],
    ["property", "og:description", SEO.description],
    ["property", "og:image", SEO.image],
    ["name", "twitter:title", SEO.title],
    ["name", "twitter:description", SEO.description],
    ["name", "twitter:image", SEO.image],
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
  console.log("[prerender:cpm] wrote dist/cpm-intensive/index.html");
};

await main();
