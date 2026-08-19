# Frontend Architecture

Read this reference for new pages, feature boundaries, data fetching, shared
state, or API integration.

## Default shape

Use the smallest structure that keeps responsibilities clear. A growing App
Router application may use:

```text
src/
  app/                 routes, layouts, loading/error boundaries
  components/          shared and UI primitives
  features/            cohesive product capabilities when they become real
  lib/api/             generated types/client adapter/error translation
  lib/                 small cross-feature utilities
```

Do not create empty feature folders or a generic framework in anticipation of
future roadmap phases. Start concrete and extract a stable abstraction only
after it improves reuse, ownership, testing, or readability.

## Server and client boundaries

Fetch and render on the server when interaction and browser APIs do not require
client execution. Keep secrets and privileged credentials server-only. Use a
Client Component for the smallest interactive subtree. Effects synchronize
with external systems; derive values during render when no synchronization is
needed.

Use URL/search parameters for state that should survive refresh, navigation,
bookmarking, or sharing. Validate and normalize every parameter.

## API boundary

`contracts/contour.openapi.json` is the pinned wire schema. A generated client
or a single typed adapter under `src/lib/api/` owns base URL handling, paths,
request serialization, response validation, cancellation, and stable error
translation. Components consume domain-oriented results rather than assembling
URLs or parsing arbitrary JSON.

Do not duplicate backend Pydantic/Python models in frontend code. Generate wire
types from OpenAPI when tooling is admitted, and keep frontend view models
separate when UI semantics differ. Runtime validation remains useful where data
crosses an untrusted boundary even when compile-time types are generated.

Mocks must conform to the pinned contract, including error envelopes and status
codes. Remove or update them when the contract changes. A breaking backend
change requires an explicit migration/versioning task rather than a silent
client workaround.

## State and races

Distinguish server data from local interaction state. Prevent older requests
from replacing newer results through cancellation, request identity, or a data
library with documented guarantees. Important submissions need clear pending
feedback and backend-supported duplicate protection where consequences matter.

Use explicit states or a state machine when independent booleans permit
impossible combinations. Keep retries bounded and make cancellation visible
when it affects the product outcome.
