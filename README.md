# disposables.app

A comprehensive database of disposable email domains, available as a static website and API.

## Features

- 5,000+ disposable email domains
- Static JSON API for easy integration
- Searchable web interface
- Curated service information with metadata

## API

The domain list is available as a JSON API at `/api.json`:

```bash
curl https://disposables.email/api.json
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
  "dateAdded": "2024-01-01"
}
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

# Build for production
bun run build

# Start production server
bun run start
```

## Data Sources

Domain data is sourced from:

- [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains)
- Manual curation for popular services

## Adding Domains

To add new domains:

1. Add domains to `domains.csv` (one per line)
2. Run `bun run build` to regenerate the API

For curated services with full metadata, edit `src/data/services.ts`.

## Credit where it is due

This design is lifted wholesale from [models.dev](https://models.dev). Thank you, models dot dev team.

## License

MIT
