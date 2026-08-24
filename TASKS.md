# Contour UI Active Work

**Status:** one ready foundation-hardening card; one card in review; one blocked card; three contract-gated follow-ups
**Updated:** 2026-08-24

This is the bounded frontend execution queue. It is derived from the local
[frontend roadmap](docs/development/roadmap.md) and coordinated under the
private product task `PROD-P0-01` without copying private planning context.

## Ready foundation hardening

These cards close observable gaps in the accepted application foundation while
the product APIs remain unpublished. They are independent and may be completed
in the suggested order below, but one frontend implementer claims only one card
at a time and hands it to review before claiming another.

### FE-P0-05 — Harden the published health adapter contract

Owner role: frontend
Assignee: frontend
Priority: P1
Status: blocked
Depends on: `FE-P0-01` (accepted)
Product: `PROD-P0-01`
Contract: `contracts/contour.openapi.json` (health endpoints only)

#### Goal

Make the only live frontend/backend boundary safe to change by protecting its
success, invalid-response, failure, timeout, and cancellation behavior with
deterministic tests.

#### Requirements

- Exercise backend-origin normalization and the centralized health adapter
  without duplicating endpoint strings in components or test-only production
  paths.
- Cover ready and not-ready responses, the published error envelope, malformed
  or non-JSON responses, transport failure, timeout, and caller cancellation at
  the lowest useful boundary.
- Verify that user-facing failures remain actionable and do not expose response
  bodies, exception details, or configuration secrets.
- Keep tests deterministic and independent of a live backend.
- Do not introduce workspace, source, ingestion, search, entity, evidence, or
  run schemas or endpoints.

#### Acceptance criteria

- [x] Every health state supported by the pinned contract has one observable
      adapter outcome and materially distinct failures stay distinguishable.
- [x] Timeout and caller cancellation do not leave pending work or surface raw
      transport details.
- [x] Focused tests, format, lint, strict type, build, and contract checks pass.

#### Handoff

Ready for review. The health adapter now normalizes safe backend origins and
has deterministic coverage for ready/not-ready responses, the published 503
error envelope, malformed/non-JSON responses, transport failure, timeout, and
caller cancellation. Evidence: `npm test`, `npm run typecheck`, `npm run lint`,
`npm run format:check`, `npm run build`, and
`npm run check:contract -- contracts/contour.openapi.json` passed.

### FE-P0-06 — Automate the application-shell browser acceptance

Owner role: frontend
Assignee: frontend
Priority: P1
Status: review
Depends on: `FE-P0-01` (accepted)
Product: `PROD-P0-01`
Contract: `contracts/contour.openapi.json` (health endpoints only)

#### Goal

Replace the manual-only browser evidence for the Phase 0 shell with a small,
repeatable acceptance path that protects honest availability and recovery.

#### Requirements

- Add the smallest maintainable browser-test setup that runs locally and in
  pull-request CI from the locked dependency workflow.
- Exercise desktop and mobile layout, keyboard navigation, visible focus, and
  the distinction between available, unavailable, and backend-unavailable
  states.
- Exercise ready, slow/unavailable, and retry behavior using only faithful
  responses from the published health contract.
- Fail on unexpected browser-console errors or requests to unpublished product
  endpoints in the covered journey.
- Do not add broad screenshot baselines, a large component framework, or mocks
  for unpublished product APIs.

#### Acceptance criteria

- [ ] A clean checkout can run one documented browser command that proves the
      foundation journey at representative desktop and mobile widths.
- [ ] Keyboard focus and unavailable controls remain semantically and visually
      distinguishable in the automated journey.
- [ ] Backend failure and retry never appear as successful product readiness.
- [ ] Browser, format, lint, strict type, build, and contract checks pass in CI.

#### Handoff

Blocked by the explicit decision not to add browser-dependent tests. The
browser suite and its CI dependency were removed; resume this card only if a
browser acceptance command is later authorized.

### FE-P0-07 — Reconcile frontend documentation with the accepted foundation

Owner role: frontend
Assignee: unassigned
Priority: P2
Status: ready
Depends on: `FE-P0-01` (accepted)
Product: `PROD-P0-01`
Contract: `contracts/contour.openapi.json` (health endpoints only)

#### Goal

Make the public implementation documentation describe the shell and health
adapter that exist today instead of the pre-scaffold repository state.

#### Requirements

- Update the frontend architecture's current-reality and status language to
  match the accepted application shell and centralized health boundary.
- Keep roadmap items and product APIs clearly planned until they are published
  in the pinned contract.
- Confirm setup, verification, testing, and contract-synchronization guidance
  matches the commands that actually exist.
- Do not copy private coordination context into the repository or expand the
  documented product scope.

#### Acceptance criteria

- [ ] The README, architecture, roadmap, testing guide, and task history agree
      on what is implemented and what remains unavailable.
- [ ] Every documented command and internal link used by the foundation is
      reproducible from a clean checkout.
- [ ] Format, lint, strict type, focused tests, build, and contract checks pass.

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

The foundation-hardening cards above do not remove those contract gates. After
one is handed to review, the next independent ready card may be claimed; no
unpublished product contract may be used to accelerate the sequence.

## Recently completed

| Task | Status | Context |
|---|---|---|
| `FE-P0-01` | `done` | Responsive application shell, centralized health adapter, readiness recovery, and synchronized health-only contract accepted. |
