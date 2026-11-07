import type { DisposableService } from "./data/types";
import {
  COLUMNS,
  PAGE_SIZE,
  defaultOrder,
  renderRow,
  searchText,
  sortValue,
  type ColumnKey,
} from "./row";

const modal = document.getElementById("modal") as HTMLDialogElement;
const modalClose = document.getElementById("close")!;
const help = document.getElementById("help")!;
const search = document.getElementById("search")! as HTMLInputElement;
const visibleCount = document.getElementById("visible-count")!;
const matchingCount = document.getElementById("matching-count")!;
const totalNote = document.getElementById("total-note")!;
const loadMore = document.getElementById("load-more")!;
const tbody = document.querySelector("table tbody")!;

/////////////////////////
// URL State Management
/////////////////////////
function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function updateQueryParams(updates: Record<string, string | null>) {
  const params = getQueryParams();
  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }
  const newPath = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.pushState({}, "", newPath);
}

/////////////////////////
// Handle "How to use"
/////////////////////////
let y = 0;

help.addEventListener("click", () => {
  y = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${y}px`;
  modal.showModal();
});

function closeDialog() {
  modal.close();
  document.body.style.position = "";
  document.body.style.top = "";
  window.scrollTo(0, y);
}

modalClose.addEventListener("click", closeDialog);
modal.addEventListener("cancel", closeDialog);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeDialog();
});

////////////////////
// Table state
////////////////////
// The HTML ships with the first page of rows already rendered. The full list
// loads from /api.json; until it arrives, search and sort have nothing to do.
type Row = { service: DisposableService; text: string };

let rows: Row[] | null = null;
let renderedHtml = "";
let query = "";
let currentSort: { column: ColumnKey; direction: "asc" | "desc" } | null = null;
let limit = PAGE_SIZE;

function matches(row: Row, terms: string[]): boolean {
  return terms.length === 0 || terms.some((term) => row.text.includes(term));
}

function compare(a: Row, b: Row): number {
  if (!currentSort) return defaultOrder(a.service, b.service);

  const column = COLUMNS.find((c) => c.key === currentSort!.column)!;
  const aValue = sortValue(a.service, column.key);
  const bValue = sortValue(b.service, column.key);

  // Handle undefined values - always sort to bottom
  if (aValue === undefined && bValue === undefined) return 0;
  if (aValue === undefined) return 1;
  if (bValue === undefined) return -1;

  const comparison =
    column.type === "number"
      ? (aValue as number) - (bValue as number)
      : String(aValue).localeCompare(String(bValue));
  return currentSort.direction === "asc" ? comparison : -comparison;
}

function render() {
  if (!rows) return;

  const terms = query
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);
  const matching = rows.filter((row) => matches(row, terms)).sort(compare);
  const visible = matching.slice(0, limit);

  // Skip the DOM swap when nothing changed (notably on first load, where the
  // server-rendered rows already match) so favicons don't flash.
  const html = visible.map((row) => renderRow(row.service)).join("");
  if (html !== renderedHtml) {
    tbody.innerHTML = html;
    renderedHtml = html;
  }
  visibleCount.textContent = visible.length.toLocaleString("en-US");
  matchingCount.textContent = matching.length.toLocaleString("en-US");
  loadMore.hidden = matching.length <= visible.length;
  totalNote.hidden = matching.length === rows.length;

  document.querySelectorAll("th.sortable").forEach((header) => {
    const indicator = header.querySelector(".sort-indicator")!;
    indicator.textContent =
      currentSort && header.getAttribute("data-key") === currentSort.column
        ? currentSort.direction === "asc"
          ? "↑"
          : "↓"
        : "";
  });
}

////////////////////
// Handle Sorting
////////////////////
document.querySelectorAll("th.sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const column = header.getAttribute("data-key") as ColumnKey;
    const direction =
      currentSort?.column === column && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    currentSort = { column, direction };
    limit = PAGE_SIZE;
    updateQueryParams({ sort: column, order: direction });
    render();
  });
});

///////////////////
// Handle Search
///////////////////
search.addEventListener("input", () => {
  query = search.value;
  limit = PAGE_SIZE;
  updateQueryParams({ search: query || null });
  render();
});

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    search.focus();
  }
});

search.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    search.value = "";
    search.dispatchEvent(new Event("input"));
    search.blur();
  }
});

///////////////////
// Handle "Show more"
///////////////////
loadMore.addEventListener("click", () => {
  limit += PAGE_SIZE * 5;
  render();
});

///////////////////////////////////
// Handle Copy domain function
///////////////////////////////////
tbody.addEventListener("click", async (e) => {
  const button = (e.target as Element).closest<HTMLButtonElement>(
    "button.copy-button"
  );
  if (!button || !navigator.clipboard) return;

  try {
    await navigator.clipboard.writeText(button.dataset.copy!);

    // Switch to check icon
    const copyIcon = button.querySelector(".copy-icon") as HTMLElement;
    const checkIcon = button.querySelector(".check-icon") as HTMLElement;

    copyIcon.style.display = "none";
    checkIcon.style.display = "block";
    button.classList.add("copied");

    // Switch back after 1 second
    setTimeout(() => {
      copyIcon.style.display = "block";
      checkIcon.style.display = "none";
      button.classList.remove("copied");
    }, 1000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

///////////////////////////////////
// Handle favicon fallback
///////////////////////////////////
// `error` doesn't bubble, so listen in the capture phase.
tbody.addEventListener(
  "error",
  (e) => {
    const img = e.target as HTMLElement;
    if (img.tagName !== "IMG") return;
    img.style.display = "none";
    (img.nextElementSibling as HTMLElement).style.display = "flex";
  },
  true
);

///////////////////////////////////
// Initialize State from URL
///////////////////////////////////
function initializeFromURL() {
  const params = getQueryParams();

  query = params.get("search") || "";
  search.value = query;

  const column = params.get("sort");
  currentSort = COLUMNS.some((c) => c.key === column)
    ? {
        column: column as ColumnKey,
        direction: params.get("order") === "desc" ? "desc" : "asc",
      }
    : null;

  limit = PAGE_SIZE;
  render();
}

window.addEventListener("popstate", initializeFromURL);

fetch("/api.json")
  .then((response) => response.json() as Promise<DisposableService[]>)
  .then((services) => {
    rows = services.map((service) => ({ service, text: searchText(service) }));
    renderedHtml = [...services]
      .sort(defaultOrder)
      .slice(0, PAGE_SIZE)
      .map(renderRow)
      .join("");
    initializeFromURL();
  })
  .catch((err) => {
    console.error("Failed to load domains: ", err);
  });
