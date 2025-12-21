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

  // Copy favicon
  const favicon = await Bun.file(
    path.join(import.meta.dir, "..", "public", "favicon.svg")
  ).arrayBuffer();
  await Bun.write(path.join(DIST_DIR, "favicon.svg"), favicon);
  console.log("  - Copied favicon.svg");

  // Generate api.json
  await Bun.write(
    path.join(DIST_DIR, "api.json"),
    JSON.stringify(services, null, 2)
  );
  console.log("  - Generated api.json");

  console.log("\nBuild complete! Output in ./dist");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
