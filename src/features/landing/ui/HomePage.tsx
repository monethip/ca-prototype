import { useState } from "react";
import { Link } from "react-router-dom";
import { ACTOR_COPY, type ActorTab } from "../model/copy";

export default function HomePage() {
  const [tab, setTab] = useState<ActorTab>("sub");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = ACTOR_COPY[tab];

  return (
    <>
      <nav className="top-nav" aria-label="Primary">
        <a className="brand" href="#top">
          <span className="mark" aria-hidden="true"></span>
          CA Payment Portal
        </a>
        <div className="nav-links">
          <a href="#flow">Platform</a>
          <a href="#packages">Solutions</a>
          <a href="#how">Resources</a>
          <a href="#activate">Enterprise</a>
          <a href="#packages">Pricing</a>
        </div>
        <div className="nav-actions">
          <Link className="btn btn-primary" to="/login">
            Sign in
          </Link>
        </div>
        <button className="menu-btn" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          ☰
        </button>
      </nav>

      <div className={`sheet${menuOpen ? " open" : ""}`} hidden={!menuOpen}>
        <button className="menu-btn" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Sign in
        </Link>
      </div>

      <header className="hero wrap" id="top">
        <h1>Buy a certificate. Pay once. Activate on the CA you already run.</h1>
        <p>
          CA - Prototype is the payment portal for existing certificate authorities. Authentication is a single login page. The
          PSP takes the money. Your CA issues the entitlement.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/login">
            Sign in to start the flow
          </Link>
          <a className="btn btn-secondary" href="#flow">
            See the integration flow
          </a>
        </div>
      </header>

      <div className="logo-strip wrap">
        <p>Built to sit between the identity you trust and the rails you already use.</p>
        <div className="logos">
          <span>Login page</span>
          <span>Session after login</span>
          <span>Existing CA</span>
          <span>QR checkout</span>
          <span>PSP webhooks</span>
          <span>Invoice export</span>
        </div>
      </div>

      <section className="band wrap" id="how">
        <h2 className="display">One subscriber context from login to fulfillment</h2>
        <p className="lede">
          The portal authenticates on one login page. After login, it orchestrates order, payment, invoice, and
          certificate activation on the CA.
        </p>
        <div className="tabbed">
          <div className="tabs" role="tablist" aria-label="Actors">
            {([
              ["sub", "Subscriber"],
              ["ca", "Certificate Authority"],
              ["portal", "Payment Portal"],
              ["psp", "Payment Gateway"],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
          <div className="pane">
            <div className="meta">{t.meta}</div>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <a href="#flow">Read the sequential process</a>
          </div>
        </div>
      </section>

      <section className="band wrap" id="flow">
        <div className="sig coral">
          <h2>Authentication is one login page. Nothing else.</h2>
          <p>
            The subscriber opens the CA - Prototype login page, enters username and password, and receives a session. Catalog,
            checkout, and fulfillment stay bound to that login. There is no sign-up flow and no SSO or OAuth2.
          </p>
          <Link className="btn btn-secondary" to="/login">
            Go to login
          </Link>
        </div>
      </section>

      <section className="band wrap">
        <h2 className="display">Purchase configuration without leaving the token</h2>
        <p className="lede">
          Package and duration drive price, tax, and total. CA - Prototype generates the order, then asks the payment gateway
          for a transaction.
        </p>
        <div className="demo-grid">
          <article className="demo peach tall">
            <h4>Package</h4>
            <div className="ui">
              <div className="bar"></div>
              <div className="bar w60"></div>
              <div className="bar w40"></div>
            </div>
            <span>Standard or Premium. The CA later provisions from this choice.</span>
          </article>
          <article className="demo mint">
            <h4>Duration</h4>
            <div className="ui">
              <div className="bar w60"></div>
              <div className="bar w40"></div>
            </div>
            <span>1 year or 2 years on the entitlement.</span>
          </article>
          <article className="demo yellow">
            <h4>Invoice calc</h4>
            <div className="ui">
              <div className="bar"></div>
              <div className="bar w40"></div>
            </div>
            <span>Price, tax, and total written to the order.</span>
          </article>
          <article className="demo mustard">
            <h4>PSP request</h4>
            <div className="ui">
              <div className="bar w60"></div>
            </div>
            <span>QR code or payment link returned to the portal.</span>
          </article>
        </div>
      </section>

      <section className="band wrap">
        <div className="sig forest">
          <h2>The gateway executes the money. The portal only listens for truth.</h2>
          <p>
            The subscriber pays through the QR or link. After the PSP verifies success, it fires a webhook or callback.
            CA - Prototype does not invent payment state — it waits for the gateway confirmation, then generates the invoice.
          </p>
          <a className="btn btn-secondary" href="#packages">
            See checkout options
          </a>
        </div>
      </section>

      <section className="band wrap">
        <div className="cream">
          <div>
            <h3 className="title">Invoice generation is automatic after confirmation</h3>
            <p className="lede" style={{ marginBottom: 0 }}>
              On webhook success the portal writes the invoice. The subscriber can view, download, or export it without
              a ticket to finance.
            </p>
          </div>
          <div className="invoice-frag">
            <table>
              <tbody>
                <tr>
                  <td>Premium · 2 years</td>
                  <td>Paid</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td>Included</td>
                </tr>
                <tr>
                  <td>Payment reference</td>
                  <td>PSP-88421</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band wrap" id="activate">
        <div className="sig dark">
          <h2>Activation is an API call with a payment reference — not a manual queue.</h2>
          <p>
            CA - Prototype calls the CA with the confirmed payment reference. The CA updates entitlements and provisions the
            certificate for the selected package and duration. Success or failure returns to the portal. The subscriber
            is notified by email or in-app message.
          </p>
          <a className="btn btn-secondary" href="#packages">
            Start a test activation
          </a>
        </div>
      </section>

      <section className="band wrap">
        <h2 className="display">Sequential process</h2>
        <p className="lede">Six steps. Four systems. One outcome: a paid, activated certificate.</p>
        <div className="steps-list">
          {[
            ["1", "Authentication and session", "Subscriber authenticates on the CA - Prototype login page. The portal issues the session."],
            ["2", "Access the payment portal", "After login, the user stays in CA - Prototype to configure the purchase."],
            ["3", "Purchase configuration", "Package and duration selected. Portal calculates the invoice and creates a PSP transaction."],
            ["4", "Transaction execution", "User pays via QR or link. Gateway confirms with webhook or callback."],
            ["5", "Invoice generation", "Portal generates the invoice. User views, downloads, or exports it."],
            ["6", "Certificate activation", "Portal sends the payment reference. CA provisions the certificate and notifies the user."],
          ].map(([n, title, body]) => (
            <div className="step-row" key={n}>
              <div className="num">{n}</div>
              <div>
                <h4 className="title" style={{ fontSize: 18, fontWeight: 500 }}>
                  {title}
                </h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="band wrap pricing" id="packages">
        <h2>Certificate packages</h2>
        <p className="sub">Standard or Premium. One or two years. Same activation path.</p>
        <div className="tiers">
          <article className="tier">
            <h3>Standard</h3>
            <p style={{ margin: 0, color: "var(--body)" }}>Core entitlement, invoice export, email notice.</p>
            <div className="price">
              1<span> / year</span>
            </div>
            <ul>
              <li>Login-page session</li>
              <li>QR or payment-link checkout</li>
              <li>Automatic invoice on webhook</li>
              <li>1-year certificate duration</li>
            </ul>
            <a className="btn-pill" href="#demo">
              Choose Standard
            </a>
          </article>
          <article className="tier featured">
            <h3>Premium</h3>
            <p style={{ margin: 0, color: "var(--body)" }}>Priority provisioning and two-year terms.</p>
            <div className="price">
              2<span> / years</span>
            </div>
            <ul>
              <li>Everything in Standard</li>
              <li>2-year entitlement window</li>
              <li>In-app and email activation notice</li>
              <li>Payment-reference API to CA</li>
            </ul>
            <a className="btn-pill solid" href="#demo">
              Choose Premium
            </a>
          </article>
        </div>
      </section>

      <section className="band wrap" id="demo">
        <div className="cta-light">
          <h2>Start building on the CA you already operate</h2>
          <Link className="btn btn-primary" to="/login">
            Sign in
          </Link>
        </div>
      </section>

      <footer className="site wrap">
        <div className="foot-grid">
          <div>
            <h4>Platform</h4>
            <Link to="/login">Login page</Link>
            <a href="#flow">Portal session</a>
            <a href="#activate">CA activation API</a>
          </div>
          <div>
            <h4>Solutions</h4>
            <a href="#packages">Standard</a>
            <a href="#packages">Premium</a>
            <a href="#how">Existing CA</a>
          </div>
          <div>
            <h4>Payments</h4>
            <a href="#flow">QR checkout</a>
            <a href="#flow">Payment link</a>
            <a href="#flow">PSP webhooks</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#how">Integration flow</a>
            <a href="#activate">Fulfillment</a>
            <a href="#packages">Packages</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#top">About CA - Prototype</a>
            <a href="#demo">Book demo</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
          </div>
        </div>
        <div className="legal">
          <span>© CA - Prototype. Payment portal for certificate authorities.</span>
          <span>Login on CA - Prototype. Money on the PSP. Certificates on the CA.</span>
        </div>
      </footer>
    </>
  );
}
