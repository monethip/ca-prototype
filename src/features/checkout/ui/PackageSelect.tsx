import { money } from "../../../shared/lib/format";
import { RATES, totals } from "../model/pricing";
import type { Certificate, DurationYears, PackageName } from "../../../types";

interface PackageSelectProps {
  cert: Certificate;
  pkg: PackageName;
  years: DurationYears;
  kind?: "issue" | "extend";
  onPkg: (pkg: PackageName) => void;
  onYears: (years: DurationYears) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const PACKAGE_OPTIONS: PackageName[] = ["Standard", "Premium"];

export default function PackageSelect({ cert, pkg, years, kind = "extend", onPkg, onYears, onCancel, onContinue }: PackageSelectProps) {
  const t = totals(pkg, years);
  return (
    <section className="view on">
      <div className="plan-board">
        <div className="plan-board-body">
          <div className="checkout-main">
            <p className="step-kicker">01 / CERTIFICATE PLAN</p>
            <h1>Select your coverage</h1>
            <p className="lede">
              {kind === "issue"
                ? `New certificate for ${cert.commonName}. Choose a plan and duration.`
                : `Renewing ${cert.commonName} (${cert.serial}). You can change or renew your plan at any time.`}
            </p>
            <div className="plans">
              {PACKAGE_OPTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={"plan" + (pkg === name ? " featured" : "")}
                  onClick={() => onPkg(name)}
                >
                  <div className="plan-top">
                    <span className="radio"></span>
                    {name === "Premium" ? <span className="badge-popular">MOST POPULAR</span> : <span></span>}
                  </div>
                  <h3>{name} Certificate</h3>
                  <p className="hint">
                    {name === "Standard" ? "For personal sites and small teams" : "For growing businesses and teams"}
                  </p>
                  <div className="price">
                    <span>{money(RATES[name][years])}</span> <span>KIP / year</span>
                  </div>
                  <ul className="checks">
                    {name === "Standard" ? (
                      <>
                        <li>Domain validation</li>
                        <li>256-bit encryption</li>
                        <li>Email support</li>
                      </>
                    ) : (
                      <>
                        <li>Organization validation</li>
                        <li>Wildcard coverage</li>
                        <li>Priority support</li>
                      </>
                    )}
                  </ul>
                </button>
              ))}
            </div>
            <div className="dur-head">
              <div>
                <strong>Subscription duration</strong>
                <p className="meta" style={{ margin: "4px 0 0" }}>
                  Longer coverage comes with better value.
                </p>
              </div>
            </div>
            <div className="dur-cards">
              <button type="button" className={"dur-card" + (years === 1 ? " on" : "")} onClick={() => onYears(1)}>
                <strong>1 year</strong>
                <span>Standard</span>
              </button>
              <button type="button" className={"dur-card" + (years === 2 ? " on" : "")} onClick={() => onYears(2)}>
                <strong>2 years</strong>
                <span>Best value</span>
              </button>
            </div>
          </div>
          <div className="plan-divider" aria-hidden="true" />
          <aside className="checkout-side">
            <div className="os-head">
              <h2>Order summary</h2>
              <span className="draft">DRAFT</span>
            </div>
            <div className="os-pkg">
              <div>
                <strong>{pkg} Certificate</strong>
                <p>{years}-year subscription</p>
                <p>{cert.commonName}</p>
              </div>
            </div>
            <div className="os-row">
              <span>Certificate coverage</span>
              <span>{years * 12} months</span>
            </div>
            <div className="os-row">
              <span>Subtotal</span>
              <span>{money(t.price)} KIP</span>
            </div>
            <div className="os-row">
              <span>Tax (10%)</span>
              <span>{money(t.tax)} KIP</span>
            </div>
            <div className="os-total">
              <span>Total due</span>
              <div>
                <strong>{money(t.total)} KIP</strong>
                <small>KIP, including tax</small>
              </div>
            </div>
            <p className="secure">Payments secured · dynamic QR checkout</p>
            <p className="invoice-hint">An invoice will be generated automatically once your payment is confirmed.</p>
          </aside>
        </div>
        <div className="invoice-actions plan-board-actions">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Back
          </button>
          <button className="btn btn-pay" type="button" onClick={onContinue}>
            Continue to billing →
          </button>
        </div>
      </div>
    </section>
  );
}
