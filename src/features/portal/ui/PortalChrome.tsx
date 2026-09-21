import type { SVGProps } from "react";
import type { ChildrenProps, PortalView } from "../../../types";

const TITLES: Partial<Record<PortalView, string>> = {
  certs: "Certificates",
  pricing: "Pricing",
  history: "History",
  package: "Select plan",
  billing: "Billing",
  qr: "Payment",
  invoice: "Invoice",
  register: "Register",
};

interface Crumb {
  id?: PortalView;
  label: string;
}

function crumbsFor(view: PortalView): Crumb[] {
  const portal: Crumb = { id: "certs", label: "Portal" };
  if (view === "pricing") return [portal, { label: "Pricing" }];
  if (view === "history") return [portal, { label: "Payment history" }];
  if (view === "package") return [portal, { id: "certs", label: "Certificates" }, { label: "Plan" }];
  if (view === "billing") return [portal, { id: "certs", label: "Certificates" }, { id: "package", label: "Plan" }, { label: "Billing" }];
  if (view === "qr") {
    return [
      portal,
      { id: "certs", label: "Certificates" },
      { id: "package", label: "Plan" },
      { id: "billing", label: "Billing" },
      { label: "Payment" },
    ];
  }
  if (view === "success") return [portal, { id: "certs", label: "Certificates" }, { label: "Success" }];
  if (view === "invoice") return [portal, { id: "certs", label: "Certificates" }, { label: "Invoice" }];
  if (view === "register") return [portal, { id: "certs", label: "Certificates" }, { label: "Register" }];
  return [portal, { label: "Certificates" }];
}

function HelpMenu() {
  return (
    <div className="help-menu">
      <button className="help-btn" type="button" aria-label="Mock data help">
        ?
      </button>
      <div className="help-pop" role="tooltip">
        <strong>Mock data — for developer testing only</strong>
        <ul>
          <li>
            <strong>Clear data</strong> — resets certificates and payment history to the default expired sample so you
            can start a fresh test.
          </li>
          <li>
            <strong>After payment</strong> — certificate validity, invoice, and payment history update automatically; open{" "}
            <em>My certificates</em> or <em>Payment history</em> again to see the refreshed data.
          </li>
        </ul>
      </div>
    </div>
  );
}

type IconName = "certs" | "pricing" | "history" | "logout";

function Icon({ name }: { name: IconName }) {
  const common: SVGProps<SVGSVGElement> = {
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "certs") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }
  if (name === "pricing") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 3v18M8 7h5.5a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5H16" />
      </svg>
    );
  }
  if (name === "history") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    );
  }
  if (name === "logout") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M15 8l5 4-5 4M4 12h16" />
    </svg>
  );
}

export default function PortalChrome({
  email,
  view,
  onCerts,
  onPricing,
  onHistory,
  onLogout,
  onCrumb,
  onBack,
  children,
}: ChildrenProps & {
  email: string;
  view: PortalView;
  onCerts: () => void;
  onPricing: () => void;
  onHistory: () => void;
  onLogout: () => void;
  onCrumb: (id: PortalView) => void;
  onBack: () => void;
}) {
  const PROCESS_STEPS: Array<{ id: PortalView; label: string }> = [
    { id: "package", label: "Plan" },
    { id: "billing", label: "Billing" },
    { id: "qr", label: "Payment" },
    { id: "success", label: "Done" },
  ];

  const title = TITLES[view] || "Portal";
  const crumbs = crumbsFor(view);
  const checkout = PROCESS_STEPS.some((s) => s.id === view);
  const showBack = checkout || view === "register";
  const stepIndex = PROCESS_STEPS.findIndex((s) => s.id === view);
  const success = view === "success";

  return (
    <div className="portal-shell">
      <div className="portal-desk-head desktop-only">
        <nav className="top-nav">
          <button className="brand" type="button" onClick={onCerts}>
            <span className="mark" aria-hidden="true"></span>
            CA - Prototype
          </button>
          <div className="nav-side">
            <span className="who">{email}</span>
            {view !== "register" ? (
              <button className="btn-link" type="button" onClick={onCerts}>
                My certificates
              </button>
            ) : null}
            <button className="btn-link" type="button" onClick={onPricing}>
              Pricing
            </button>
            <button className="btn-link" type="button" onClick={onHistory}>
              Payment history
            </button>
            <button className="btn-link" type="button" onClick={onLogout}>
              Sign out
            </button>
            <HelpMenu />
          </div>
        </nav>
        <nav className="crumbs-bar" aria-label="Breadcrumb">
          <div className="crumbs">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              const crumbId = c.id;
              return (
                <span key={c.label + i}>
                  {i > 0 && <span className="crumb-sep">/</span>}
                  {last || !crumbId ? (
                    <span className={last ? "crumb-current" : ""}>{c.label}</span>
                  ) : (
                    <button type="button" className="crumb-link" onClick={() => onCrumb(crumbId)}>
                      {c.label}
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </nav>
      </div>

      <header className="app-bar mobile-only">
        <div className="app-bar-inner">
          {showBack ? (
            <button className="app-bar-btn" type="button" onClick={onBack} aria-label="Back">
              ‹
            </button>
          ) : (
            <span className="mark" aria-hidden="true"></span>
          )}
          <strong>{title}</strong>
          <div className="app-bar-actions">
            <HelpMenu />
            <button className="app-bar-btn" type="button" onClick={onLogout} aria-label="Log out">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </header>

      {checkout && (
        <div className={"process-progress" + (success ? " success" : "")} aria-label="Checkout progress">
          <ol className="process-steps">
            {PROCESS_STEPS.map((s, i) => {
              const state = success || i < stepIndex ? "done" : i === stepIndex ? "current" : "";
              const clickable = !success && i < stepIndex && s.id !== "success";
              return (
                <li key={s.id} className={state}>
                  {clickable ? (
                    <button type="button" onClick={() => onCrumb(s.id)}>
                      <span className="process-dot">{i + 1}</span>
                      {s.label}
                    </button>
                  ) : (
                    <span className="process-label">
                      <span className="process-dot">{i + 1}</span>
                      {s.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {children}
      <nav className="bottom-nav mobile-only" aria-label="Primary">
        <div className="bottom-nav-inner">
          <button type="button" className={view === "certs" || checkout ? "on" : ""} onClick={onCerts}>
            <Icon name="certs" />
            Certificates
          </button>
          <button type="button" className={view === "pricing" ? "on" : ""} onClick={onPricing}>
            <Icon name="pricing" />
            Pricing
          </button>
          <button type="button" className={view === "history" ? "on" : ""} onClick={onHistory}>
            <Icon name="history" />
            History
          </button>
        </div>
      </nav>
    </div>
  );
}
