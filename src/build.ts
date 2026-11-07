import { cp } from "fs/promises";
import { Rendered, services } from "./render";
import path from "path";

const DIST_DIR = path.join(import.meta.dir, "..", "dist");

async function build() {
  console.log("Building static site...");

  // Clean dist directory
  await Bun.$`rm -rf ${DIST_DIR}`;
  await Bun.$`mkdir -p ${DIST_DIR}`;

  // Read index.html template
  const indexHtml = await Bun.file(
    path.join(import.meta.dir, "..", "index.html")
  ).text();

  // Inject SSR content
  const staticHtml = indexHtml
    .replace("<!--static-->", Rendered)
    .replace('./src/index.ts', '/index.js')
    .replace('./src/index.css', '/index.css')
    .replace('./public/favicon.svg', '/favicon.svg');

  // Write static HTML
  await Bun.write(path.join(DIST_DIR, "index.html"), staticHtml);
  console.log("  - Generated index.html");

  // Bundle client-side JS
  const result = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "index.ts")],
    outdir: DIST_DIR,
    minify: true,
  });

  if (!result.success) {
    console.error("Failed to bundle JS:", result.logs);
    process.exit(1);
  }
  console.log("  - Bundled index.js");

  // Copy CSS
  const css = await Bun.file(path.join(import.meta.dir, "index.css")).text();
  await Bun.write(path.join(DIST_DIR, "index.css"), css);
  console.log("  - Copied index.css");

  // Copy static files (favicon, robots.txt, 404 page, Cloudflare _headers)
  await cp(path.join(import.meta.dir, "..", "public"), DIST_DIR, {
    recursive: true,
  });
  console.log("  - Copied public/");

  // Generate api.json
  await Bun.write(path.join(DIST_DIR, "api.json"), JSON.stringify(services));
  console.log(`  - Generated api.json (${services.length} services)`);

  // Generate domains.txt: every domain, alternate domains included
  const domains = [
    ...new Set(
      services.flatMap((service) => [service.domain, ...service.altDomains])
    ),
  ].sort();
  await Bun.write(path.join(DIST_DIR, "domains.txt"), domains.join("\n") + "\n");
  console.log(`  - Generated domains.txt (${domains.length} domains)`);

  console.log("\nBuild complete! Output in ./dist");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
