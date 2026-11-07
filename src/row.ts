import type { DisposableService } from "./data/types";

// Shared between the build-time render and the browser so the first page of
// server-rendered rows and the client-rendered rows are byte-for-byte alike.

// Only the first page of rows ships in the HTML; the rest render on demand.
export const PAGE_SIZE = 200;

export const COLUMNS = [
  { key: "domain", label: "Domain", type: "text" },
  { key: "status", label: "Status", type: "text" },
  { key: "pricing", label: "Pricing", type: "text" },
  { key: "retention", label: "Retention", type: "text" },
  { key: "api", label: "API", type: "boolean" },
  { key: "custom-inbox", label: "Custom Inbox", type: "boolean" },
  { key: "attachments", label: "Attachments", type: "boolean" },
  { key: "replyable", label: "Replyable", type: "boolean" },
  { key: "domains", label: "Domains", type: "number" },
] as const;

export type ColumnKey = (typeof COLUMNS)[number]["key"];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Curated services (anything with real metadata) lead the default order;
// the long tail of bare blocklist domains follows alphabetically.
export function defaultOrder(a: DisposableService, b: DisposableService): number {
  const aCurated = a.website ? 0 : 1;
  const bCurated = b.website ? 0 : 1;
  return aCurated - bCurated || a.domain.localeCompare(b.domain);
}

// `undefined` sorts to the bottom regardless of direction, matching "-" cells.
export function sortValue(
  service: DisposableService,
  key: ColumnKey
): string | number | undefined {
  switch (key) {
    case "domain":
      return service.domain;
    case "status":
      return service.status;
    case "pricing":
      return service.pricing;
    case "retention":
      return service.retention?.toLowerCase();
    case "api":
      return service.features.api ? "yes" : "no";
    case "custom-inbox":
      return service.features.customInbox ? "yes" : "no";
    case "attachments":
      return service.features.attachments ? "yes" : "no";
    case "replyable":
      return service.features.replyable ? "yes" : "no";
    case "domains":
      return service.domainCount;
  }
}

// Everything a visitor can see in a row, plus the name and alternate
// domains, so searching "sharklasers.com" finds Guerrilla Mail.
export function searchText(service: DisposableService): string {
  return [
    service.domain,
    service.name,
    service.status,
    service.pricing,
    service.retention || "-",
    service.features.api ? "yes" : "no",
    service.features.customInbox ? "yes" : "no",
    service.features.attachments ? "yes" : "no",
    service.features.replyable ? "yes" : "no",
    String(service.domainCount),
    ...service.altDomains,
  ]
    .join(" ")
    .toLowerCase();
}

const FALLBACK_ICON = `<span class="fallback-icon" style="display: none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span>`;

const EXTERNAL_LINK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

const COPY_ICON = `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;

const CHECK_ICON = `<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><polyline points="20,6 9,17 4,12"></polyline></svg>`;

const feature = (enabled: boolean) =>
  enabled
    ? `<span class="feature-yes">Yes</span>`
    : `<span class="feature-no">No</span>`;

export function renderRow(service: DisposableService): string {
  const domain = escapeHtml(service.domain);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(service.domain)}&amp;sz=32`;
  const website = service.website
    ? `<a class="website-link" href="${escapeHtml(service.website)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(service.website)}">${EXTERNAL_LINK_ICON}</a>`
    : "-";

  return (
    `<tr data-domain="${domain}">` +
    `<td><div class="domain-cell"><img src="${favicon}" alt="" loading="lazy" />${FALLBACK_ICON}<span class="domain-text">${domain}</span><button class="copy-button" data-copy="${domain}" title="Copy domain">${COPY_ICON}${CHECK_ICON}</button></div></td>` +
    `<td><span class="status-badge ${escapeHtml(service.status)}"><span class="status-dot"></span>${escapeHtml(service.status)}</span></td>` +
    `<td>${escapeHtml(service.pricing)}</td>` +
    `<td>${service.retention ? escapeHtml(service.retention) : "-"}</td>` +
    `<td>${feature(service.features.api)}</td>` +
    `<td>${feature(service.features.customInbox)}</td>` +
    `<td>${feature(service.features.attachments)}</td>` +
    `<td>${feature(service.features.replyable)}</td>` +
    `<td>${service.domainCount}</td>` +
    `<td>${website}</td>` +
    `</tr>`
  );
}
