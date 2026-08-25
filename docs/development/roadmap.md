# Frontend Development Roadmap

**Status:** Phase 0 foundation active; shell and health boundary accepted
**Updated:** 2026-08-25

## Planning rule

Build one honest browser path in step with published backend contracts. The
active queue turns the earliest independent slice into one reviewable card; it
does not authorize speculative screens or APIs.

## Phase 0 sequence

### 0.1 — Application foundation (accepted implementation; browser automation blocked)

The accepted foundation includes the strict TypeScript App Router application,
lockfile, deterministic format/lint/type/test/build commands, pull-request CI,
environment configuration, accessible responsive design tokens, and the shared
application shell. API origin handling, transport, response validation,
cancellation, timeout behavior, and error mapping are centralized around the
health-only pinned contract. The shell exposes useful readiness and retry
feedback while later capabilities remain honestly unavailable.

Automated browser acceptance is not installed or run in CI. The browser card
remains explicitly blocked by the decision not to add browser-dependent tests;
the accepted manual browser evidence is recorded in the task history.

### 0.2 — Workspace and source setup

After the backend publishes contracts, implement workspace selection/creation,
source validation, source addition, useful validation errors, and safe repeat
submission behavior.

### 0.3 — Ingestion progress and recovery

Implement the published progress model, stage status, failure detail, retry,
cancellation, refresh/reconnect behavior, and links to source and run state.

### 0.4 — Explore and evidence

Implement search, empty/not-found boundaries, entity and relationship detail,
source-version display, exact evidence locators, and producing-run inspection.

### 0.5 — Phase 0 browser gate

Verify the complete sample path from clean startup through source setup,
processing, search, entity inspection, and exact evidence. Exercise loading,
empty, failure, retry, cancellation, responsive, keyboard, and
backend-unavailable behavior.

## Admission rule

Do not build Phase 1+ investigation, graph, temporal, agent, governance, scale,
evaluation, or domain-pack interfaces as active features before their product
phase and backend contract. Navigation may preserve the long-term product shape
only when unavailable behavior is explicit and useful.

## Completion contract

A roadmap item is complete when its user action works against the accepted
contract, important UI states are handled, accessibility and responsive
behavior are appropriate, relevant automated and browser checks pass, and a
clean environment can reproduce the result.
