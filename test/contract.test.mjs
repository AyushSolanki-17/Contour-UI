import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

test("the pinned contract exposes only the published health paths", async () => {
  const contract = JSON.parse(
    await readFile(join(repositoryRoot, "contracts/contour.openapi.json"), "utf8"),
  );

  assert.deepEqual(Object.keys(contract.paths).sort(), ["/health/live", "/health/ready"]);
});
