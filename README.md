# disposables.app

A comprehensive database of disposable email domains, available as a static website and API.

## Features

- 10,000+ disposable email domains
- Static JSON API and plain-text list for easy integration
- Searchable web interface
- Curated service information with metadata

## API

The domain list is available as a JSON API at `/api.json`:

```bash
curl https://disposables.app/api.json
```

Each entry contains:

```json
{
  "domain": "example.com",
  "name": "Example",
  "status": "unknown",
  "pricing": "unknown",
  "features": {
    "api": false,
    "customInbox": false,
    "attachments": false,
    "replyable": false
  },
  "domainCount": 1,
  "altDomains": [],
  "dateAdded": "2016-03-16"
}
```

`dateAdded` is the day the domain first appeared in the upstream list (`2014-09-02` is that list's first commit), or the day it was classified, for domains from `additions.txt`.

Alternate domains for a curated service are nested under `altDomains`, not listed as their own entries.

If you only need the domains, `/domains.txt` has one domain per line, alternate domains included:

```bash
curl https://disposables.app/domains.txt
```

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime

### Setup

```bash
bun install
```

### Commands

```bash
# Start development server
bun run dev

# Refresh src/data/upstream.txt from disposable-email-domains
bun run sync

# Build the static site into ./dist
bun run build

# Serve ./dist locally with Cloudflare's runtime
bun run preview

# Build and deploy to Cloudflare
bun run deploy
```

The `Deploy` GitHub Action builds and deploys to Cloudflare on every push to `main`. Every Monday it also runs `bun run sync`, commits any change, and deploys. Deploys need the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets; without them the workflow still syncs and builds, then skips the deploy step.

## Data Sources

Domain data is sourced from:

- [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains), mirrored in `src/data/upstream.txt`
- `src/data/additions.txt`, for disposable domains confirmed in [Buttondown](https://buttondown.com)'s signup data that upstream doesn't list yet
- Manual curation for popular services, in `src/data/services.ts`

## Adding Domains

The best place for a new domain is upstream: open a pull request against [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains), and the weekly sync will pick it up.

To list a domain here in the meantime, add it to `src/data/additions.txt` as `domain YYYY-MM-DD`, one per line. Only add domains used for throwaway addresses. Don't add a domain just because it sent spam, because it's a typo of a real provider (`gamil.com`), or because a real organization uses it.

For curated services with full metadata, edit `src/data/services.ts`.
