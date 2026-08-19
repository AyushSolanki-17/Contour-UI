import { getJson } from "./client";

export type HealthStatus = "live" | "ready";
type HealthResponse = { status: HealthStatus };

const HEALTH_ENDPOINTS = {
  ready: "/health/ready",
} as const;

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== "object" || value === null || !("status" in value)) return false;
  const status = value.status;
  return status === "live" || status === "ready";
}

export type Readiness =
  | { state: "ready"; status: "ready" }
  | { state: "unavailable"; message: string };

export async function getReadiness(): Promise<Readiness> {
  try {
    const response = await getJson<HealthResponse>(HEALTH_ENDPOINTS.ready, isHealthResponse);
    return response.status === "ready"
      ? { state: "ready", status: response.status }
      : { state: "unavailable", message: "The backend is not ready yet." };
  } catch (error) {
    return {
      state: "unavailable",
      message: error instanceof Error ? error.message : "The backend is unavailable.",
    };
  }
}
