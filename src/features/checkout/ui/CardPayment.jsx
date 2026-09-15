import { useState } from "react";
import {
  brandMeta,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isCardComplete,
} from "../model/cardBrand.js";

const EMPTY = { number: "", name: "", expiry: "", cvc: "" };
const ICONS = ["visa", "mastercard", "unionpay"];

function BrandIcon({ brand }) {
  if (brand === "visa") {
    return (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#1a1f71" />
        <text x="24" y="21" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
          VISA
        </text>
      </svg>
    );
  }
  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#111" />
        <circle cx="19" cy="16" r="8" fill="#eb001b" />
        <circle cx="29" cy="16" r="8" fill="#f79e1b" />
      </svg>
    );
  }
  if (brand === "amex") {
    return (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#006fcf" />
        <text x="24" y="21" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
          AMEX
        </text>
      </svg>
    );
  }
  if (brand === "unionpay") {
    return (
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#00447c" />
        <rect x="8" y="6" width="10" height="20" rx="2" fill="#d71920" />
        <rect x="19" y="6" width="10" height="20" rx="2" fill="#00447c" />
        <rect x="30" y="6" width="10" height="20" rx="2" fill="#007a3d" />
        <text x="24" y="20" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700" fontFamily="Arial, sans-serif">
          UnionPay
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#ff6000" />
      <text x="24" y="21" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
        DISC
      </text>
    </svg>
  );
}

export default function CardPayment({ pay, order, onConfirm }) {
  const [card, setCard] = useState(EMPTY);
  const [error, setError] = useState(false);
  const brand = detectCardBrand(card.number);
  const meta = brandMeta(brand);

  function submit(e) {
    e.preventDefault();
    if (!isCardComplete(card) || pay.status === "paid") {
      setError(true);
      return;
    }
    setError(false);
    onConfirm();
  }

  return (
    <div className="card-pay">
      <div className="card-brands" aria-label="Accepted cards">
        {ICONS.map((id) => (
          <span key={id} className={"card-brand-icon" + (brand === id ? " on" : "")} title={brandMeta(id).name}>
            <BrandIcon brand={id} />
          </span>
        ))}
      </div>
      <div className={"plastic-card brand-" + brand} style={{ "--card-color": meta.color }}>
        <div className="plastic-top">
          <span className="chip" aria-hidden="true" />
          <span className="plastic-brand">{brand === "unknown" ? "CARD" : meta.name.toUpperCase()}</span>
        </div>
        <p className="plastic-number">{card.number || "•••• •••• •••• ••••"}</p>
        <div className="plastic-foot">
          <div>
            <span>Cardholder</span>
            <strong>{card.name || "YOUR NAME"}</strong>
          </div>
          <div>
            <span>Expires</span>
            <strong>{card.expiry || "MM / YY"}</strong>
          </div>
        </div>
      </div>
      <form id="cardPaymentForm" onSubmit={submit}>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="ACCT-000003"
              required
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
            />
          </div>
          <div className="field full">
            <label htmlFor="cardName">Name on card</label>
            <input
              id="cardName"
              autoComplete="cc-name"
              required
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="field">
            <label htmlFor="cardExpiry">Expiry</label>
            <input
              id="cardExpiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM / YY"
              required
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
            />
          </div>
          <div className="field">
            <label htmlFor="cardCvc">CVC</label>
            <input
              id="cardCvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={brand === "amex" ? "1234" : "123"}
              required
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3) })}
            />
          </div>
        </div>
        <p className="meta" style={{ marginTop: 16 }}>
          Payment reference <strong>{pay.ref}</strong>
          {" · "}
          Amount <strong>{order.total.toFixed(2)} KIP</strong>
        </p>
        {error && <p className="form-err on">Enter a complete card number, name, expiry, and CVC.</p>}
        {pay.status === "paid" && <p className="ok">Payment confirmed. Invoice is being generated.</p>}
        <div className="actions" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="btn btn-pay" type="submit" disabled={pay.status === "paid"}>
            Pay with card
          </button>
        </div>
      </form>
    </div>
  );
}
