# Frontend Testing Standard

**Status:** required engineering standard
**Updated:** 2026-08-25

## Test admission

Tests protect observable behavior, API compatibility, accessibility, security,
failure handling, responsive behavior, or a confirmed regression. Test count
and coverage percentage are not delivery goals.

Choose the lowest-cost layer that proves the behavior. Do not test framework
internals, generated code, component file structure, or styling tokens merely
because they exist. Avoid repeating one behavior at every layer.

## Layers

- Unit tests cover non-trivial validation, transformations, and explicit state
  transitions.
- Component tests cover important interactions, forms, focus, and async UI
  states.
- Integration tests cover the centralized API adapter, stable error mapping,
  cancellation, and contract-faithful mocks.
- Browser tests cover the critical user journey, navigation, keyboard use,
  realistic viewports, backend failure, and recovery.
- Contract checks prove the frontend snapshot matches the intended
  backend-generated OpenAPI artifact.

## Current foundation verification

From a locked install, the complete automated foundation check is:

```shell
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run check:contract -- /path/to/contour.openapi.json
```

`npm test` runs six focused health-adapter tests and one test asserting that the
pinned contract exposes only the two published health paths. The contract
command accepts the backend-generated artifact explicitly; in the paired
workspace it may be run without an argument to use
`../contour/openapi/contour.openapi.json`.

Pull-request CI runs the same format, lint, strict type, focused test, build,
and contract-script checks from the locked dependency graph. It supplies the
checked-in snapshot to the contract script because the sibling backend artifact
is not part of an independent frontend checkout.

## Verification proportionality

Documentation-only and configuration changes normally need relevant static,
contract, or link checks. Small UI changes need focused behavior checks.
Pages and API integrations require relevant tests, lint, strict type checking,
contract verification, and targeted browser inspection. Authentication,
sensitive data, complex state, and critical journeys require deeper failure,
race, security, accessibility, and end-to-end coverage.

## Browser quality

There is currently no installed browser-test runner, browser-test command, or
browser job in pull-request CI. The accepted shell received manual desktop and
mobile inspection. Automated browser acceptance is tracked by the blocked
`FE-P0-06` card and must not be implied by the automated checks above.

For meaningful UI work, inspect the states the workflow can produce: loading,
empty, success, failure, retry, unavailable, slow, and repeated interaction.
Check mobile and desktop layout, keyboard operation, visible focus, useful
labels and errors, console failures, and unexpected network behavior as
relevant.

## Definition of done

A frontend change is done when acceptance behavior works; the pinned contract
matches; relevant loading/failure states are honest; accessibility, responsive
layout, security, stale-response behavior, and performance are appropriate;
relevant checks pass; documentation describes actual behavior; and a clean
environment can reproduce the result.
