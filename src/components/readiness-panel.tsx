"use client";

import type { Readiness } from "@/lib/api/health";

export function ReadinessPanel({ readiness }: { readiness: Readiness }) {
  const ready = readiness.state === "ready";

  return (
    <section className="status-panel" aria-labelledby="status-title">
      <div>
        <p className="eyebrow">System status</p>
        <h2 id="status-title">{ready ? "Contour is ready to connect." : "Waiting for the backend."}</h2>
        <p>{ready ? "The published readiness check completed successfully. Workspace and source APIs are not published yet." : readiness.message}</p>
      </div>
      <div className="status-actions">
        <div className={`status-indicator status-indicator-${readiness.state}`} role="status" aria-live="polite">
          <span className="indicator-dot" aria-hidden="true" />{ready ? "Ready" : "Unavailable"}
        </div>
        {!ready && (
          <button className="retry-button" type="button" onClick={() => window.location.reload()}>
            Retry readiness check
          </button>
        )}
      </div>
    </section>
  );
}
