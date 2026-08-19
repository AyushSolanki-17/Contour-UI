# Contour UI

Contour UI is the separately deployable browser application for Contour, an
evidence-backed knowledge and investigation platform for complex, evolving
domains.

## Repository status

The frontend engineering and agentic-development foundation is present; the
application scaffold has not yet been implemented. The first ready card is in
[`TASKS.md`](TASKS.md).

The backend currently publishes only liveness and readiness endpoints. Planned
workspace, source, ingestion, search, entity, relationship, evidence, and run
surfaces must not be integrated until they appear in the generated OpenAPI
contract.

## Read first

1. [Project scope](docs/project-scope.md)
2. [Frontend architecture](docs/architecture/frontend.md)
3. [Development roadmap](docs/development/roadmap.md)
4. [Testing standard](docs/quality/testing.md)
5. [API contract synchronization](contracts/README.md)

Repository-wide coding-agent instructions live in [AGENTS.md](AGENTS.md).

## Contract synchronization

In the paired local workspace, verify that the pinned snapshot still matches
the sibling backend:

```shell
./scripts/check-backend-contract.sh
```

After an intentionally coordinated backend contract change, update the
snapshot:

```shell
./scripts/sync-backend-contract.sh
```

Both commands accept an explicit OpenAPI artifact path for independent
checkouts or CI.
