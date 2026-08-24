# Contour UI

Contour UI is the separately deployable browser application for Contour, an
evidence-backed knowledge and investigation platform for complex, evolving
domains.

## Repository status

The Phase 0 browser foundation is implemented as a small responsive shell. It
shows backend readiness when `CONTOUR_API_URL` is configured and keeps all
planned product surfaces visibly unavailable until their APIs are published.
The active work queue is in [`TASKS.md`](TASKS.md).

The backend currently publishes only liveness and readiness endpoints. Planned
workspace, source, ingestion, search, entity, relationship, evidence, and run
surfaces must not be integrated until they appear in the generated OpenAPI
contract.

## Read first

1. [Project scope](docs/project-scope.md)
2. [Frontend architecture](docs/architecture/frontend.md)
3. [Development roadmap](docs/development/roadmap.md)
4. [Testing standard](docs/quality/testing.md)
5. [API contract synchronization](contracts/README.md)

Repository-wide coding-agent instructions live in [AGENTS.md](AGENTS.md).

## Local development

Use Node.js 20 or newer (the repository includes an `.nvmrc`), then install the
locked dependencies and start the development server:

```shell
npm ci
cp .env.example .env.local
npm run dev
```

The shell works without a backend and reports that state honestly. Set
`CONTOUR_API_URL` in `.env.local` to the backend origin to enable the published
readiness check. No credentials belong in this file or in the browser bundle.

Before committing, run:

```shell
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
npm run check:contract /path/to/contour.openapi.json
```

The contract command needs the paired backend artifact; without an explicit
path it looks for `../contour/openapi/contour.openapi.json`.

`npm run test:browser` builds the app and verifies the responsive shell against
a local health-contract fixture. Install its browser once after `npm ci` with:

```shell
npx playwright install chromium
```

## Contract synchronization

In the paired local workspace, verify that the pinned snapshot still matches
the sibling backend:

```shell
./scripts/check-backend-contract.sh
```

After an intentionally coordinated backend contract change, update the
snapshot:

```shell
./scripts/sync-backend-contract.sh
```

Both commands accept an explicit OpenAPI artifact path for independent
checkouts or CI.
