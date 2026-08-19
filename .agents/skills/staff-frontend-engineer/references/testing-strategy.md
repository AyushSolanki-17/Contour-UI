# Frontend Testing Strategy

Choose tests by regression risk, not by file count or coverage percentage.

## Admission rule

Add a permanent test only when it protects an observable interaction, API
contract, accessibility behavior, failure mode, security property, responsive
invariant, or confirmed regression not already covered more cheaply. Avoid
tests that assert component internals, class strings, generated code, framework
behavior, or mocks that merely restate the implementation.

## Layers

- Unit-test non-trivial transformations, validation, and state transitions.
- Component-test important interaction, form, focus, and async-state behavior.
- Integration-test the API adapter, stable error mapping, cancellation, and
  contract-faithful mock flows.
- Browser-test the critical product journey, navigation, responsive behavior,
  and the user-visible recovery path.

Do not duplicate the same behavior at every layer. Prefer representative
success coverage plus materially different failures.

## Verification by risk

- Documentation or configuration: relevant static and link checks.
- Small UI behavior: focused test plus lint/type checks where practical.
- Page or API integration: relevant component/integration tests, contract
  check, lint, type checking, and targeted browser inspection.
- Authentication, sensitive data, major state, or critical journey: failure,
  race, keyboard, responsive, security, console/network, and end-to-end checks.

Visual inspection should include the states the change can actually produce.
Do not manufacture an elaborate QA pass for a trivial copy or spacing change.

## Definition of done

A frontend change is done when its user-visible acceptance behavior works, the
pinned backend contract matches, meaningful async and failure states are
handled, accessibility and responsive behavior are appropriate, relevant
checks pass, private context is absent, and documentation describes actual—not
merely planned—behavior.
