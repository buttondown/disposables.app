import Index from "../index.html";
import { Rendered, services } from "./render";
import path from "path";

// Static file server on port 16000
Bun.serve({
  port: 16_000,
  routes: {
    "/": Index,
    "/src/*": (req) => {
      const url = new URL(req.url);
      const filePath = path.join(import.meta.dir, "..", url.pathname);
      const file = Bun.file(filePath);
      return new Response(file);
    },
    "/public/*": (req) => {
      const url = new URL(req.url);
      const filePath = path.join(import.meta.dir, "..", url.pathname);
      const file = Bun.file(filePath);
      return new Response(file);
    },
  },
});

// Main server with SSR
const server = Bun.serve({
  development: true,
  hostname: "0.0.0.0",
  async fetch(req) {
    // Reject WebSocket upgrade requests
    if (req.headers.get("upgrade") === "websocket") {
      return new Response("WebSocket upgrades not supported", {
        status: 426,
        headers: {
          Upgrade: "Required",
        },
      });
    }

    const url = new URL(req.url);

    // API endpoint
    if (url.pathname === "/api.json") {
      return new Response(JSON.stringify(services, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Proxy to static server
    url.host = "localhost:16000";
    const result = fetch(url.toString(), req);

    if (url.pathname !== "/") return result;

    // SSR for index page
    let html = await result.then((r) => r.text());
    html = html.replace("<!--static-->", Rendered);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Server running at http://${server.hostname}:${server.port}`);
