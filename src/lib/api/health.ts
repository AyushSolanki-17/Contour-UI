import { getJson } from "./client";

export type HealthStatus = "live" | "ready";
type HealthResponse = { status: HealthStatus };

export type Readiness =
  | { state: "ready"; status: "ready" }
  | { state: "unavailable"; message: string };

export async function getReadiness(): Promise<Readiness> {
  try {
    const response = await getJson<HealthResponse>("/health/ready");
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
