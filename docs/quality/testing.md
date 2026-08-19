# Frontend Testing Standard

**Status:** required engineering standard
**Updated:** 2026-08-19

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

## Verification proportionality

Documentation-only and configuration changes normally need relevant static,
contract, or link checks. Small UI changes need focused behavior checks.
Pages and API integrations require relevant tests, lint, strict type checking,
contract verification, and targeted browser inspection. Authentication,
sensitive data, complex state, and critical journeys require deeper failure,
race, security, accessibility, and end-to-end coverage.

## Browser quality

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
