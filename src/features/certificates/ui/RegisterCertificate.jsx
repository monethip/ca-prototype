import { money } from "../../../shared/lib/format.js";
import { RATES, totals } from "../../checkout/model/pricing.js";

function Field({ id, label, required, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function FileField({ id, label, required, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      <input
        key={value || "empty"}
        id={id}
        type="file"
        aria-required={required}
        onChange={(e) => onChange(e.target.files?.[0]?.name || "")}
      />
      {value ? <p className="meta">{value}</p> : null}
    </div>
  );
}

const MOCK_ENROLL = {
  phone: "+856 20 5555 0202",
  email: "noy.sengthong@example.la",
  purpose: "enterprise",
  authMode: "pin",
  attachDoc: "enterprise-registration.pdf",
  identityDoc: "passport-id-sample.pdf",
  personalName: "Noy Sengthong",
  tin: "TIN-01022026",
  organization: "Vientiane Digital Trust Co., Ltd.",
  organizationUnit: "Certificate Operations",
  title: "Operations Manager",
  locality: "Vientiane",
  state: "Vientiane Capital",
  username: "noy.sengthong",
};

export default function RegisterCertificate({ form, error, onChange, onClear, onSubmit }) {
  const t = totals(form.pkg || "Premium", form.years || 1);
  function set(key, value) {
    onChange({ ...form, [key]: value });
  }

  function fillMockData() {
    onChange({ ...form, ...MOCK_ENROLL, email: form.email || MOCK_ENROLL.email });
  }

  return (
    <section className="view on">
      <form className="about-form" onSubmit={onSubmit}>
        <div className="about-head">
          <h1>Register certificate</h1>
          <button className="btn btn-secondary mock-fill-btn" type="button" onClick={fillMockData}>
            Fill mock data
          </button>
        </div>

        <div className="about-row">
          <div className="about-legend">
            <h2>Owner information</h2>
            <p>Provide your contact details</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">
              
              <Field id="enrollPhone" label="Phone Number" required>
                <input
                  id="enrollPhone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field id="enrollEmail" label="Email" required>
                <input
                  id="enrollEmail"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="about-row">
          <div className="about-legend">
            <h2>Certificate information</h2>
            <p>Purpose, authentication, and documents</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">
              <Field id="enrollPurpose" label="Certificate Purpose" required>
                <select
                  id="enrollPurpose"
                  required
                  value={form.purpose}
                  onChange={(e) => set("purpose", e.target.value)}
                >
                  <option value="enterprise">Enterprise</option>
                  <option value="staff">Staff</option>
                  <option value="personal">Personal</option>
                </select>
              </Field>
              <Field id="enrollAuth" label="Authentication Modes" required>
                <select
                  id="enrollAuth"
                  required
                  value={form.authMode}
                  onChange={(e) => set("authMode", e.target.value)}
                >
                  <option value="pin">PIN</option>
                  <option value="tse">TSE</option>
                </select>
              </Field>
            </div>
            <FileField
              id="enrollDoc"
              label="Attach document"
              required
              value={form.attachDoc}
              onChange={(name) => set("attachDoc", name)}
            />
            <FileField
              id="enrollId"
              label="Personal ID (PID) / Passport ID (PPID)"
              required
              value={form.identityDoc}
              onChange={(name) => set("identityDoc", name)}
            />
          </div>
        </div>

        <div className="about-row">
          <div className="about-legend">
            <h2>Enroll certificate request</h2>
            <p>Identity used on the certificate</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">
              <Field id="enrollName" label="Personal Name" required>
                <input
                  id="enrollName"
                  required
                  value={form.personalName}
                  onChange={(e) => set("personalName", e.target.value)}
                />
              </Field>
              <Field id="enrollTin" label="Tax code (TIN)" required>
                <input
                  id="enrollTin"
                  required
                  value={form.tin}
                  onChange={(e) => set("tin", e.target.value)}
                />
              </Field>
              <Field id="enrollOrg" label="Organization">
                <input id="enrollOrg" value={form.organization} onChange={(e) => set("organization", e.target.value)} />
              </Field>
              <Field id="enrollOu" label="Organization Unit">
                <input
                  id="enrollOu"
                  value={form.organizationUnit}
                  onChange={(e) => set("organizationUnit", e.target.value)}
                />
              </Field>
              <Field id="enrollTitle" label="Title">
                <input id="enrollTitle" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field id="enrollLocality" label="Locality">
                <input id="enrollLocality" value={form.locality} onChange={(e) => set("locality", e.target.value)} />
              </Field>
              <Field id="enrollState" label="State or Province">
                <input id="enrollState" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
              <Field id="enrollUser" label="Username" required>
                <input
                  id="enrollUser"
                  required
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* <div className="plan-board enroll-plan">
          <p className="step-kicker">01 / CERTIFICATE PLAN</p>
          <div className="plan-board-body">
            <div className="checkout-main">
              <h1>Select your coverage</h1>
              <p className="lede">Choose a package and duration for this enrollment.</p>
              <div className="plans">
                {["Standard", "Premium"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={"plan" + (form.pkg === name ? " featured" : "")}
                    onClick={() => set("pkg", name)}
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
                      <span>{money(RATES[name][form.years || 1])}</span> <span>KIP / year</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="dur-head">
                <strong>Subscription duration</strong>
              </div>
              <div className="dur-cards">
                <button type="button" className={"dur-card" + (form.years === 1 ? " on" : "")} onClick={() => set("years", 1)}>
                  <strong>1 year</strong>
                  <span>Standard</span>
                </button>
                <button type="button" className={"dur-card" + (form.years === 2 ? " on" : "")} onClick={() => set("years", 2)}>
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
                  <strong>{form.pkg} Certificate</strong>
                  <p>{form.years}-year subscription</p>
                  <p>{form.personalName || form.email || "New enrollment"}</p>
                </div>
              </div>
              <div className="os-row">
                <span>Certificate coverage</span>
                <span>{(form.years || 1) * 12} months</span>
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
            </aside>
          </div>
        </div> */}

        {error ? <p className="form-err on">Please complete required fields and attach both documents.</p> : null}
        <div className="invoice-actions">
          <button className="btn btn-secondary" type="button" onClick={onClear}>
            Clear form
          </button>
          <button className="btn btn-pay" type="submit">
            Submit enrollment
          </button>
        </div>
      </form>
    </section>
  );
}
