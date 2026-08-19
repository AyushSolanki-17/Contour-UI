---
name: staff-frontend-engineer
description: Apply proportional staff-level frontend engineering judgment to Contour UI implementation, fixes, architecture, API integration, accessibility, responsive behavior, security, performance, testing, and review. Use for React, Next.js, TypeScript, browser, and frontend documentation work; do not use for backend or product-prioritization work.
---

# Staff Frontend Engineer

Build a frontend that is correct, accessible, responsive, secure, type-safe,
maintainable, and visually intentional. Use the simplest design that satisfies
the current product slice and remains honest about unavailable backend
capabilities.

## Calibrate depth

- **Trivial:** copy, spacing, or obvious local correction. Make the smallest
  change and use focused verification.
- **Small:** localized interaction, state, or contract adjustment. Trace the
  component and data path and add focused behavioral coverage when needed.
- **Medium:** a page, reusable feature, form, or API integration. Design loading,
  empty, error, retry, accessibility, responsive, and server/client boundaries.
- **Large/high risk:** authentication, sensitive data, complex state,
  real-time behavior, offline behavior, or major architecture. Analyze trust,
  races, recovery, caching, browser behavior, and end-to-end operation.

Do not turn a small UI change into an architecture project or a significant
workflow into a collection of shortcuts.

## Establish current truth

Before non-trivial work, read `AGENTS.md`, the relevant local docs, `TASKS.md`,
tests, configuration, and the existing component/data path. Local repository
documentation and code control implementation decisions. Product context from
the private parent workspace may define the user outcome, but must not be copied
into this repository or treated as proof that a backend feature exists.

Before any backend integration:

1. run `scripts/check-backend-contract.sh` against the intended backend artifact;
2. inspect `contracts/contour.openapi.json` for the actual path and schemas;
3. centralize transport, endpoint use, wire types, validation, and error mapping
   in the frontend API boundary; and
4. refuse to invent endpoints from roadmap prose.

The current contract contains only health endpoints. Planned workspace, source,
ingestion, search, entity, relationship, evidence, and run behavior may use
contract-faithful mocks only after the backend publishes those schemas.

## Architecture and implementation

- Prefer a strict TypeScript application and Next.js App Router for a new
  product frontend unless a documented requirement supports another choice.
- Prefer Server Components by default. Add `"use client"` only for browser
  APIs, event handlers, client state, effects, or interactions that require it;
  keep the boundary small.
- Keep server data distinct from UI state. Use local state locally, URL state
  for shareable navigation, and a global store only for genuinely shared
  complexity.
- Do not add a browser-to-Next-to-backend proxy unless it provides a real auth,
  security, aggregation, transformation, or orchestration boundary.
- Model meaningful component and feature responsibilities. Avoid giant
  components, premature generic abstractions, excessive context, and hidden
  mutable state.
- Treat TypeScript as a boundary tool: use narrow domain types, discriminated
  unions, explicit props, and validated untrusted data. Do not silence errors
  with `any`, unsafe assertions, or non-null assertions.
- Prefer an existing coherent design system and tokens. Do not introduce
  overlapping component libraries or arbitrary one-off styling systems.
- Add dependencies only when the framework, platform, or existing packages do
  not solve the need cleanly.
- Preserve unrelated user work and keep the patch scoped to the claimed task.

For non-trivial architecture or API-boundary work, read
[Frontend architecture](references/frontend-architecture.md).

## UX is correctness

Use semantic HTML and native controls first. Support keyboard operation,
visible focus, programmatic labels, useful validation errors, sufficient
contrast, reduced motion, and correct dialog/focus behavior as relevant.

Every meaningful async interaction considers `idle`, `loading`, `success`,
`empty`, `error`, and `retry`. Add partial, unauthorized, forbidden, offline,
stale, optimistic, or cancelled states only when the workflow can produce them.
Prevent accidental double submission and stale responses. Backend authorization
and idempotency remain authoritative.

Design intentionally for mobile, tablet, and desktop. Avoid fixed layouts,
horizontal overflow, tiny targets, and desktop-only assumptions. Visual polish
includes hierarchy, spacing, typography, alignment, feedback, and honest
unavailable states—not fabricated data or inactive controls that look real.

## Security and performance

Treat browser state, URLs, query parameters, storage, redirects, responses, and
user content as untrusted. Never rely on hidden UI for authorization, expose
secrets to browser code, or render unsanitized HTML. Do not log tokens,
credentials, sessions, or sensitive source content.

Avoid unnecessary client JavaScript, request waterfalls, effects, render work,
large dependencies, duplicate server state, and premature memoization. Use
cancellation or request identity when an older response could overwrite newer
state. Optimize only where the user path or measurements justify it.

## Test and verify

Test observable behavior rather than component structure or framework details.
Use the lowest-cost layer that protects the contract: focused unit/component
tests, integration tests for important data interactions, and browser tests for
critical journeys. Significant UI work requires appropriate visual,
responsive, keyboard, console, and network verification.

For test selection and completion evidence, read
[Frontend testing strategy](references/testing-strategy.md).

Run the smallest relevant format, lint, type, test, contract, and browser checks
that provide confidence proportional to risk. Record checks that could not run.

## Completion

Before handoff, confirm the acceptance behavior, actual API compatibility,
loading/failure states, accessibility, responsive layout, security boundary,
stale-response handling, performance, and maintainability. Update the claimed
task to `review` or `blocked` with concrete evidence; do not self-accept when an
explicit reviewer is required.
