import path from "path";

const UPSTREAM_URL =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";
const OUTPUT = path.join(import.meta.dir, "..", "src", "data", "upstream.txt");

const response = await fetch(UPSTREAM_URL);
if (!response.ok) {
  console.error(`Failed to fetch upstream blocklist: ${response.status}`);
  process.exit(1);
}

const domains = [
  ...new Set(
    (await response.text())
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith("#"))
  ),
].sort();

// Each line is `domain YYYY-MM-DD`: the day the domain first showed up upstream
// (backfilled from upstream's git history). Keep existing dates; a domain new
// to this sync is dated today, at most a week after upstream added it.
const previous = new Map(
  (await Bun.file(OUTPUT).exists())
    ? (await Bun.file(OUTPUT).text())
        .split("\n")
        .filter(Boolean)
        .map((line) => line.split(" ") as [string, string])
    : []
);
const today = new Date().toISOString().slice(0, 10);
const added = domains.filter((domain) => !previous.has(domain));
const current = new Set(domains);
const removed = [...previous.keys()].filter((domain) => !current.has(domain));

// A truncated or broken upstream file shouldn't silently wipe the list.
const MAX_REMOVALS = 500;
if (removed.length > MAX_REMOVALS) {
  console.error(
    `Refusing to sync: upstream dropped ${removed.length} domains (limit ${MAX_REMOVALS}).`
  );
  process.exit(1);
}

await Bun.write(
  OUTPUT,
  domains.map((domain) => `${domain} ${previous.get(domain) ?? today}`).join("\n") +
    "\n"
);
console.log(
  `Wrote ${domains.length} domains to src/data/upstream.txt (+${added.length} / -${removed.length})`
);
