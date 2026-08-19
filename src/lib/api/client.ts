const DEFAULT_TIMEOUT_MS = 5000;

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;

  constructor(message: string, options: { status?: number; code?: string } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
  }
}

export function getApiOrigin(): string | undefined {
  const origin = process.env.CONTOUR_API_URL?.trim();
  return origin ? origin.replace(/\/$/, "") : undefined;
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const origin = getApiOrigin();
  if (!origin) throw new ApiError("The Contour backend origin is not configured.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const response = await fetch(`${origin}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      const message = typeof body?.error?.message === "string"
        ? body.error.message
        : `Contour backend returned HTTP ${response.status}.`;
      const code = typeof body?.error?.code === "string" ? body.error.code : undefined;
      throw new ApiError(message, { code, status: response.status });
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("The Contour backend did not respond in time.");
    }
    throw new ApiError("The Contour backend is unavailable.");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
  }
}
