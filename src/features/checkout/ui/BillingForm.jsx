import { money } from "../../../shared/lib/format.js";
import { totals } from "../model/pricing.js";

const FIELDS = [
  ["firstName", "First name", "given-name", false],
  ["lastName", "Last name", "family-name", false],
  ["company", "Company / organization", "organization", true],
  ["email", "Email", "email", false],
  ["phone", "Phone", "tel", false],
  ["location", "Address / location", "street-address", true],
  ["city", "City", "address-level2", false],
  ["country", "Country", "country-name", false],
];

const MOCK_BUYER = {
  firstName: "Noy",
  lastName: "Sengthong",
  company: "Vientiane Digital Trust Co., Ltd.",
  email: "noy.sengthong@example.la",
  phone: "+856 20 5555 0101",
  location: "Rue Setthathilath, Chanthabouly District",
  city: "Vientiane",
  country: "Lao PDR",
};

export default function BillingForm({ pkg, years, cert, buyer, error, onChange, onBack, onSubmit }) {
  const t = totals(pkg, years);
  const fillMockData = () => onChange({ ...MOCK_BUYER, email: buyer.email || MOCK_BUYER.email });

  return (
    <section className="view on">
      <div className="buyer-form qr-card" style={{ maxWidth: 760, textAlign: "left" }}>
        <p className="step-kicker">02 / CUSTOMER DETAILS</p>
        <div className="billing-title-row">
          <h1>Billing information</h1>
          <button className="btn btn-secondary mock-fill-btn" type="button" onClick={fillMockData}>
            Fill mock data
          </button>
        </div>
        <p className="lede">Enter the payer details to print on the invoice, then continue to payment.</p>
        <div className="buyer-summary">
          <strong>{pkg} Certificate</strong>
          <p className="meta" style={{ margin: "6px 0 0" }}>
            {years}-year subscription · {money(t.total)} KIP
            {cert ? " · " + cert.commonName : ""}
          </p>
        </div>
        <form id="buyerForm" onSubmit={onSubmit}>
          <div className="form-grid">
            {FIELDS.map(([key, label, auto, full]) => (
              <div className={"field" + (full ? " full" : "")} key={key}>
                <label htmlFor={key}>{label}</label>
                {key === "location" ? (
                  <textarea
                    id={key}
                    required={key !== "company"}
                    value={buyer[key]}
                    onChange={(e) => onChange({ ...buyer, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    id={key}
                    type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                    autoComplete={auto}
                    required={key !== "company"}
                    value={buyer[key]}
                    onChange={(e) => onChange({ ...buyer, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <p className={`form-err${error ? " on" : ""}`}>Please fill in all required fields.</p>
          <div className="invoice-actions" style={{ marginTop: 24 }}>
            <button className="btn btn-secondary" type="button" onClick={onBack}>
              Back to plan
            </button>
            <button className="btn btn-pay" type="submit">
              Continue to payment →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
