const DEFAULT_TIMEOUT_MS = 5000;

export type ApiErrorKind =
  | "configuration"
  | "http"
  | "invalid-response"
  | "timeout"
  | "cancelled"
  | "unavailable";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly code: string | undefined;

  constructor(
    message: string,
    options: { kind: ApiErrorKind; status?: number; code?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
  }
}

export function normalizeApiOrigin(value: string | undefined): string | undefined {
  const origin = value?.trim();
  if (!origin) return undefined;

  try {
    const url = new URL(origin);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:")
      || url.username
      || url.password
      || !/^\/+$/u.test(url.pathname)
      || url.search
      || url.hash
    ) {
      return undefined;
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

export function getApiOrigin(): string | undefined {
  return normalizeApiOrigin(process.env.CONTOUR_API_URL);
}

export async function getJson<T>(
  path: string,
  validate: (value: unknown) => value is T,
  signal?: AbortSignal,
): Promise<T> {
  const origin = getApiOrigin();
  if (!origin) {
    throw new ApiError("The Contour backend origin is not configured.", {
      kind: "configuration",
    });
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, DEFAULT_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const response = await fetch(`${origin}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      const code = typeof body?.error?.code === "string" ? body.error.code : undefined;
      const message = response.status === 503
        ? "The Contour backend is not ready yet. Try again shortly."
        : "The Contour backend returned an unexpected response. Try again.";
      throw new ApiError(message, { kind: "http", code, status: response.status });
    }
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new ApiError("The Contour backend returned an invalid response.", {
        kind: "invalid-response",
      });
    }
    if (!validate(body)) {
      throw new ApiError("The Contour backend returned an invalid response.", {
        kind: "invalid-response",
      });
    }
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (timedOut) {
      throw new ApiError("The Contour backend did not respond in time. Try again.", {
        kind: "timeout",
      });
    }
    if (signal?.aborted) {
      throw new ApiError("The readiness check was cancelled.", { kind: "cancelled" });
    }
    throw new ApiError("The Contour backend is unavailable. Try again.", {
      kind: "unavailable",
    });
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
  }
}
