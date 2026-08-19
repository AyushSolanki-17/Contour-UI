# Contour UI Active Work

**Status:** one ready card; three contract-gated follow-ups
**Updated:** 2026-08-19

This is the bounded frontend execution queue. It is derived from the local
[frontend roadmap](docs/development/roadmap.md) and coordinated under the
private product task `PROD-P0-01` without copying private planning context.

## Active queue

### FE-P0-01 — Establish the frontend application foundation

Owner role: frontend
Assignee: frontend
Priority: P1
Status: accepted
Depends on: none
Product: `PROD-P0-01`
Contract: `contracts/contour.openapi.json` (health endpoints only)

#### Goal

Create a runnable, maintainable browser foundation that makes Contour's Phase 0
product shape visible without pretending that planned backend capabilities are
already available.

#### Requirements

- Establish the frontend project, locked dependency workflow, strict typing,
  formatting, linting, focused tests, and continuous integration.
- Build an accessible, responsive application shell with coherent design
  tokens and navigation for the Phase 0 product surfaces.
- Mark surfaces that lack a published backend contract as honestly unavailable;
  do not fabricate production data or endpoints.
- Create one centralized API boundary driven by the pinned OpenAPI contract and
  configurable backend origin.
- Integrate the published liveness/readiness behavior with useful ready,
  unavailable, and retry feedback.
- Document reproducible local startup and verification.

#### Acceptance criteria

- [ ] A clean checkout installs from a lockfile and starts with documented
      commands.
- [ ] Format, lint, strict type, focused test, build, and contract checks are
      deterministic and available to CI.
- [ ] The shell works at realistic mobile and desktop widths and supports
      keyboard navigation with visible focus.
- [ ] Implemented, unavailable, loading, and backend-unavailable states are
      visually and semantically distinct.
- [ ] No component contains a duplicated backend endpoint string or hand-written
      claim that an unpublished API exists.
- [ ] The checked-in OpenAPI snapshot matches the accepted backend artifact.
- [ ] No private parent-workspace material is present in the repository.

#### Handoff

An implementer moves this card to `in-progress` when claimed and to `review`
with commands and browser evidence when complete. A separate reviewer accepts
and archives it.

Accepted review: readiness retry and runtime health validation added; static
checks, production build, contract comparison, and desktop/mobile browser DOM
inspection pass.

## Scheduled follow-ups

These cards preserve the user-facing sequence, but they are not ready while
their required product API is absent from the pinned OpenAPI snapshot. Before
promotion, record the accepted backend task and exact synchronized contract
digest in the card.

### FE-P0-02 — Implement workspace and source setup

Owner role: frontend
Assignee: unassigned
Priority: P1
Status: planned
Depends on: `FE-P0-01`; published workspace and source contract
Product: `PROD-P0-01`
Contract: unpublished; current snapshot contains health endpoints only

#### Goal

Let a user create or choose a workspace, validate a supported source, and add it
safely against the accepted backend contract.

#### Requirements

- Synchronize and pin the accepted backend artifact before changing client
  types or endpoint use.
- Implement workspace selection/creation and supported-source validation and
  addition through the centralized API boundary.
- Make loading, empty, validation, duplicate submission, permission, backend
  failure, retry, and unsupported-source states explicit and accessible.
- Preserve safe repeat submission behavior defined by the published contract.
- Do not mock or implement ingestion, search, entity, evidence, or run APIs in
  production code.

#### Acceptance criteria

- [ ] The workspace/source path uses only paths and schemas in the pinned
      contract, with no endpoint strings duplicated in components.
- [ ] Validation and backend failures preserve user input where safe and offer
      an understandable next action.
- [ ] Repeat submission cannot create accidental duplicate source setup beyond
      the backend contract's declared behavior.
- [ ] Responsive, keyboard, focused component/browser, build, and contract
      checks pass.

### FE-P0-03 — Implement ingestion progress and recovery

Owner role: frontend
Assignee: unassigned
Priority: P1
Status: planned
Depends on: `FE-P0-02`; published ingestion, job, and run contract
Product: `PROD-P0-01`
Contract: unpublished; no progress semantics exist in the current snapshot

#### Goal

Let a user start ingestion, understand its current stage, and recover from
failure or interruption without using a terminal.

#### Requirements

- Synchronize the accepted progress contract, including lifecycle, retry,
  cancellation, refresh/reconnect, and stable error behavior.
- Show queued, active, completed, failed, cancelled, retrying, and temporarily
  unavailable states only when the contract defines them.
- Link progress to the relevant source and producing run.
- Preserve accepted state across refresh and distinguish stale display from an
  empty or successful result.
- Do not invent streaming, polling, percentage, stage, or retry semantics.

#### Acceptance criteria

- [ ] The UI renders every published lifecycle state and offers only actions
      valid for that state.
- [ ] Refresh, reconnect, cancellation, failure detail, and retry behavior work
      against faithful contract fixtures and the accepted backend.
- [ ] Backend unavailability never appears as successful completion or empty
      progress.
- [ ] Responsive, keyboard, focused component/browser, build, and contract
      checks pass.

### FE-P0-04 — Implement search, entity, evidence, and run inspection

Owner role: frontend
Assignee: unassigned
Priority: P1
Status: planned
Depends on: `FE-P0-03`; published search, entity, relationship, evidence, source-version, and run contract
Product: `PROD-P0-01`
Contract: unpublished; no exploration schemas exist in the current snapshot

#### Goal

Let a user search admitted knowledge, open an entity and its relationships, and
resolve every credited result to exact evidence, its immutable source version,
and producing run.

#### Requirements

- Synchronize the accepted exploration and evidence contract before client or
  screen implementation.
- Implement known-result, empty, not-found, validation, permission, stale,
  backend-failure, and retry states through the centralized API boundary.
- Keep relationship evidence and source/run navigation explicit; never present
  a connection as causality or an unsupported result as known truth.
- Render exact evidence locators and explicit unknown temporal values without
  fabricating source metadata.
- Do not add Phase 1 hybrid search, investigations, graph canvas, or agent UI.

#### Acceptance criteria

- [ ] A known sample query opens an entity, a relationship, exact evidence, the
      immutable source version, and producing run using only published schemas.
- [ ] Empty, not-found, stale, unavailable, and permission states remain
      semantically distinct.
- [ ] Every credited result exposes one-click evidence access and no component
      duplicates endpoint strings or wire types.
- [ ] Responsive, keyboard, focused component/browser, build, and contract
      checks pass.

## Promotion and handoff rule

Do not promote these cards merely because their predecessor is accepted. The
corresponding backend paths and schemas must exist in the generated OpenAPI
artifact, the frontend snapshot must be intentionally synchronized, and the
digest must be recorded first. Claim one ready frontend card at a time; a
separate reviewer accepts and archives it.
