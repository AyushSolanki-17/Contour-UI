import type { ReactNode } from "react";
import type { Readiness } from "@/lib/api/health";

const navigation = [
  { label: "Overview", href: "#overview", available: true },
  { label: "Workspaces", href: "#workspaces", available: false },
  { label: "Sources", href: "#sources", available: false },
  { label: "Explore", href: "#explore", available: false },
];

function ReadinessBadge({ readiness }: { readiness: Readiness }) {
  return readiness.state === "ready"
    ? <span className="status status-ready">Backend ready</span>
    : <span className="status status-unavailable">Backend unavailable</span>;
}

export function AppShell({ children, readiness }: { children: ReactNode; readiness: Readiness }) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Contour overview">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Contour</span>
        </a>
        <div className="topbar-meta">
          <ReadinessBadge readiness={readiness} />
          <span className="phase-label">Phase 0 foundation</span>
        </div>
      </header>
      <div className="shell-body">
        <aside className="sidebar" aria-label="Primary navigation">
          <p className="eyebrow">Workspace</p>
          <nav>
            <ul className="nav-list">
              {navigation.map((item) => (
                <li key={item.label}>
                  {item.available ? (
                    <a className="nav-link nav-link-active" href={item.href} aria-current="page">
                      <span>{item.label}</span><span className="nav-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="nav-link nav-link-disabled" aria-disabled="true">
                      <span>{item.label}</span><span className="nav-unavailable">Soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-note">
            <p className="eyebrow">Contract status</p>
            <p>Only liveness and readiness are published by the backend today.</p>
          </div>
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
