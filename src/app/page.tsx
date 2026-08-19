import { AppShell } from "@/components/app-shell";
import { getReadiness } from "@/lib/api/health";

export default async function Home() {
  const readiness = await getReadiness();
  return (
    <AppShell readiness={readiness}>
      <section className="hero" id="overview" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Source to evidence</p>
          <h1 id="page-title">A clear path from source material to trusted evidence.</h1>
          <p className="hero-summary">Contour will help teams build an evidence-backed view of complex, evolving domains. The browser foundation is ready; product surfaces will appear as their backend contracts are published.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" />
          <span className="orbit-core">C</span>
        </div>
      </section>

      <section className="status-panel" aria-labelledby="status-title">
        <div>
          <p className="eyebrow">System status</p>
          <h2 id="status-title">{readiness.state === "ready" ? "Contour is ready to connect." : "Waiting for the backend."}</h2>
          <p>{readiness.state === "ready" ? "The published readiness check completed successfully. Workspace and source APIs are not published yet." : readiness.message}</p>
        </div>
        <div className={`status-indicator status-indicator-${readiness.state}`} role="status">
          <span className="indicator-dot" aria-hidden="true" />{readiness.state === "ready" ? "Ready" : "Unavailable"}
        </div>
      </section>

      <section className="surface-grid" aria-labelledby="surfaces-title">
        <div className="section-heading">
          <div><p className="eyebrow">Product surfaces</p><h2 id="surfaces-title">The foundation is intentionally small.</h2></div>
          <p>Future capabilities stay visible without looking available.</p>
        </div>
        <div className="surface-cards">
          <article className="surface-card surface-card-active"><span className="card-index">01</span><h3>Application shell</h3><p>Responsive navigation, status feedback, and an accessible starting point.</p><span className="card-state">Available now</span></article>
          <article className="surface-card"><span className="card-index">02</span><h3>Workspace &amp; sources</h3><p>Workspace selection and source setup will follow the published API contract.</p><span className="card-state">Unavailable</span></article>
          <article className="surface-card"><span className="card-index">03</span><h3>Explore &amp; evidence</h3><p>Search, entities, relationships, and exact evidence are planned for a later slice.</p><span className="card-state">Unavailable</span></article>
        </div>
      </section>
    </AppShell>
  );
}
