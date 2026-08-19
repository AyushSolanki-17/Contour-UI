#!/bin/sh

set -eu

script_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
frontend_root=$(CDPATH= cd -- "$script_directory/.." && pwd)
backend_contract=${1:-"$frontend_root/../contour/openapi/contour.openapi.json"}
frontend_contract="$frontend_root/contracts/contour.openapi.json"

if [ ! -f "$backend_contract" ]; then
  echo "Backend OpenAPI artifact not found: $backend_contract" >&2
  exit 1
fi

if [ ! -f "$frontend_contract" ]; then
  echo "Frontend OpenAPI snapshot not found: $frontend_contract" >&2
  exit 1
fi

if ! cmp -s "$backend_contract" "$frontend_contract"; then
  echo "Frontend OpenAPI snapshot differs from: $backend_contract" >&2
  echo "Run scripts/sync-backend-contract.sh after the contract change is accepted." >&2
  exit 1
fi

echo "Frontend OpenAPI snapshot matches: $backend_contract"
