import assert from "node:assert/strict";
import test from "node:test";

import {
  ApiError,
  getApiOrigin,
  getJson,
  normalizeApiOrigin,
} from "../src/lib/api/client.ts";
import { getReadiness } from "../src/lib/api/health.ts";

const originalFetch = globalThis.fetch;
const originalOrigin = process.env.CONTOUR_API_URL;

function restoreEnvironment() {
  globalThis.fetch = originalFetch;
  if (originalOrigin === undefined) {
    delete process.env.CONTOUR_API_URL;
  } else {
    process.env.CONTOUR_API_URL = originalOrigin;
  }
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isHealthResponse(value: unknown): value is { status: "live" | "ready" } {
  return typeof value === "object" && value !== null && "status" in value;
}

test.afterEach(restoreEnvironment);

test("normalizes valid backend origins and rejects non-origin configuration", () => {
  assert.equal(normalizeApiOrigin(" https://api.example.test/// "), "https://api.example.test");
  assert.equal(normalizeApiOrigin("http://[::1]:8000/"), "http://[::1]:8000");
  assert.equal(normalizeApiOrigin("https://api.example.test/v1"), undefined);
  assert.equal(normalizeApiOrigin("https://user:secret@api.example.test"), undefined);
  assert.equal(normalizeApiOrigin("file:///tmp/contour"), undefined);
  assert.equal(normalizeApiOrigin("not a URL"), undefined);

  process.env.CONTOUR_API_URL = " https://api.example.test/ ";
  assert.equal(getApiOrigin(), "https://api.example.test");
});

test("maps ready and not-ready health responses through the centralized adapter", async () => {
  process.env.CONTOUR_API_URL = "https://api.example.test/";
  const requested: string[] = [];
  globalThis.fetch = async (input) => {
    requested.push(String(input));
    return response({ status: requested.length === 1 ? "ready" : "live" });
  };

  assert.deepEqual(await getReadiness(), { state: "ready", status: "ready" });
  assert.deepEqual(await getReadiness(), {
    state: "unavailable",
    message: "The backend is not ready yet.",
  });
  assert.deepEqual(requested, [
    "https://api.example.test/health/ready",
    "https://api.example.test/health/ready",
  ]);
});

test("maps the published error envelope without exposing its message", async () => {
  process.env.CONTOUR_API_URL = "https://api.example.test";
  globalThis.fetch = async () => response({
    error: { code: "dependency_unavailable", message: "database password is visible here" },
  }, 503);

  await assert.rejects(
    getJson("/health/ready", isHealthResponse),
    (error: unknown) => error instanceof ApiError
      && error.kind === "http"
      && error.status === 503
      && error.code === "dependency_unavailable"
      && error.message === "The Contour backend is not ready yet. Try again shortly.",
  );
});

test("rejects malformed and non-JSON success responses as invalid", async () => {
  process.env.CONTOUR_API_URL = "https://api.example.test";
  globalThis.fetch = async () => response({ unexpected: true });
  await assert.rejects(getJson("/health/ready", isHealthResponse), {
    name: "ApiError",
    kind: "invalid-response",
  });

  globalThis.fetch = async () => new Response("not JSON", { status: 200 });
  await assert.rejects(getJson("/health/ready", isHealthResponse), {
    name: "ApiError",
    kind: "invalid-response",
  });
});

test("maps transport failure and caller cancellation without raw transport details", async () => {
  process.env.CONTOUR_API_URL = "https://api.example.test";
  globalThis.fetch = async () => {
    throw new Error("socket ECONNREFUSED secret-hostname");
  };
  await assert.rejects(
    getJson("/health/ready", isHealthResponse),
    (error: unknown) => error instanceof ApiError
      && error.kind === "unavailable"
      && !error.message.includes("ECONNREFUSED"),
  );

  const controller = new AbortController();
  globalThis.fetch = async (_input, init) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  });
  const request = getJson("/health/ready", isHealthResponse, controller.signal);
  controller.abort();
  await assert.rejects(request, {
    name: "ApiError",
    kind: "cancelled",
  });
});

test("maps a timed-out request without leaving its timeout pending", async () => {
  process.env.CONTOUR_API_URL = "https://api.example.test";
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  let timeoutCleared = false;
  let scheduledTimeout: ReturnType<typeof setTimeout> | undefined;

  globalThis.setTimeout = ((callback: TimerHandler) => {
    scheduledTimeout = {} as ReturnType<typeof setTimeout>;
    queueMicrotask(() => {
      if (typeof callback === "function") callback();
    });
    return scheduledTimeout;
  }) as unknown as typeof setTimeout;
  globalThis.clearTimeout = ((timeout: ReturnType<typeof setTimeout>) => {
    if (timeout === scheduledTimeout) timeoutCleared = true;
  }) as unknown as typeof clearTimeout;
  globalThis.fetch = async (_input, init) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  });

  try {
    await assert.rejects(getJson("/health/ready", isHealthResponse), {
      name: "ApiError",
      kind: "timeout",
    });
    assert.equal(timeoutCleared, true);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});
