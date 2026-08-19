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

cp "$backend_contract" "$frontend_contract"
"$script_directory/check-backend-contract.sh" "$backend_contract"
