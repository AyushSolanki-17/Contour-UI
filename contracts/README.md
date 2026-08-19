# Backend API Contract Snapshot

`contour.openapi.json` is a pinned copy of the generated contract owned by the
Contour backend. It is the only authority for implemented HTTP paths and wire
schemas in this repository.

Do not edit the JSON by hand. In the paired workspace, compare it with the
sibling backend artifact:

```shell
./scripts/check-backend-contract.sh
```

After a coordinated contract change has been reviewed, synchronize it:

```shell
./scripts/sync-backend-contract.sh
```

For independent checkouts or CI, pass the backend artifact path explicitly:

```shell
./scripts/check-backend-contract.sh /path/to/contour.openapi.json
./scripts/sync-backend-contract.sh /path/to/contour.openapi.json
```

The current snapshot contains only `GET /health/live` and
`GET /health/ready`. Roadmap items are not callable APIs.
