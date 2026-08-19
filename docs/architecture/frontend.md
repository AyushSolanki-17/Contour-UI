# Frontend Architecture

**Status:** controlling initial direction; application code not yet implemented
**Updated:** 2026-08-19

## Current reality

The repository currently contains instructions, documentation, a task queue,
and a pinned OpenAPI snapshot. The application scaffold is the next ready task.
The backend contract currently contains only health endpoints.

## Initial direction

Use a strict TypeScript browser application with an architecture proportional
to the first product slice. Next.js App Router is the preferred starting point
unless an accepted local decision demonstrates a better fit.

Keep responsibilities explicit:

```text
route/layout
  -> feature or page component
  -> frontend API adapter
  -> generated/pinned HTTP contract
  -> Contour backend
```

Components never import backend Python internals or call a database. Backend
authorization and invariants remain authoritative.

## Rendering and state

Prefer Server Components for content that does not require browser interaction.
Use Client Components for the smallest subtree that needs events, browser APIs,
local interactive state, or effects.

Keep server data separate from UI state. Prefer local state for local behavior,
URL state for shareable navigation and filters, and a dedicated shared-state
library only after real complexity justifies it. Avoid copying server responses
into multiple stores.

## API boundary

`contracts/contour.openapi.json` is the checked-in frontend snapshot of the
backend-generated contract. Synchronization procedures live in
[the contract guide](../../contracts/README.md).

All base URL handling, paths, request serialization, response validation,
cancellation, and stable error translation belong in one API boundary, expected
under `src/lib/api/` once the application exists. Components consume typed,
domain-oriented results rather than assembling URLs or parsing arbitrary JSON.

Generate wire types from OpenAPI when the project selects tooling. Keep view
models separate when UI semantics differ. Contract types do not replace runtime
validation at an untrusted network boundary.

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
