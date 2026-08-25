# Frontend Architecture

**Status:** controlling accepted foundation architecture; later product slices planned
**Updated:** 2026-08-25

## Current reality

The repository contains an accepted strict TypeScript Next.js App Router
foundation. It renders an accessible responsive application shell, reports
backend readiness, offers a retry when readiness is unavailable, and presents
later product surfaces as unavailable.

The centralized API boundary validates the backend origin and readiness
response, applies a request timeout, preserves caller cancellation, and maps
configuration, HTTP, malformed-response, timeout, cancellation, and transport
failures to safe frontend errors. The pinned backend contract still contains
only `GET /health/live` and `GET /health/ready`; the shell calls only the
readiness endpoint.

## Accepted foundation

The application uses a strict TypeScript Next.js App Router architecture
proportional to the implemented slice:

```text
src/app/                 route, layout, and global styles
src/components/          application shell and readiness presentation
src/lib/api/             shared transport and health adapter
test/                    focused adapter and contract tests
```

The accepted request path keeps responsibilities explicit:

```text
server-rendered home route
  -> readiness adapter
  -> shared API transport
  -> generated/pinned HTTP contract
  -> Contour backend
```

Components never import backend Python internals or call a database. Backend
authorization and invariants remain authoritative.

## Rendering and state

The home route and application shell remain Server Components. The readiness
panel is the small Client Component boundary needed for its browser reload
action. Future content should remain server-rendered unless interaction or a
browser API requires a client boundary.

Keep server data separate from UI state. Prefer local state for local behavior,
URL state for shareable navigation and filters, and a dedicated shared-state
library only after real complexity justifies it. Avoid copying server responses
into multiple stores.

## API boundary

`contracts/contour.openapi.json` is the checked-in frontend snapshot of the
backend-generated contract. Synchronization procedures live in
[the contract guide](../../contracts/README.md).

All base URL handling, paths, request serialization, response validation,
cancellation, timeout behavior, and stable error translation belong in the
existing `src/lib/api/` boundary. Components consume typed, domain-oriented
results rather than assembling URLs or parsing arbitrary JSON.

The health adapter currently defines its narrow wire type locally and validates
the response at runtime. Generate broader wire types from OpenAPI only after
the project selects tooling and the corresponding product contract is
published. Keep view models separate when UI semantics differ; contract types
do not replace runtime validation at an untrusted network boundary.

## Product shell

The initial shell should provide coherent navigation and clearly distinguish:

- implemented and available;
- implemented but backend-unavailable;
- planned but unavailable; and
- loading, empty, failure, and retry states.

Later roadmap surfaces must not appear functional through fake production data
or invented endpoints.

## Security and configuration

Use explicit environment configuration for the backend origin. Keep secrets and
privileged credentials out of browser bundles. Treat URLs, query parameters,
storage, redirects, API data, and user content as untrusted. Server-side
authorization remains mandatory even when UI controls are hidden.
