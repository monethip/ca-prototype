import { useState } from "react";
import QrPayment from "./QrPayment";
import CardPayment from "./CardPayment";
import type { Invoice, Order, Payment } from "../../../types";

type PaymentMethod = "qr" | "card";

interface PaymentStepProps {
  qrUrl: string;
  pay: Payment;
  order: Order;
  ttl: number;
  onConfirm: (paymentMethod?: Invoice["paymentMethod"]) => void;
}

export default function PaymentStep({ qrUrl, pay, order, ttl, onConfirm }: PaymentStepProps) {
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [readyToPay, setReadyToPay] = useState(false);

  function chooseMethod(nextMethod: PaymentMethod) {
    setMethod(nextMethod);
    setReadyToPay(false);
  }

  return (
    <section className="view on">
      <div className="qr-card pay-step">
        <p className="step-kicker">03 / PAYMENT</p>
        {!readyToPay ? (
          <>
            <h1>PAYMENT OPTION</h1>
            <p className="lede">Choose how you want to pay, then continue to the selected payment screen.</p>
            <fieldset className="payment-options" aria-label="Payment method">
              <label className={"payment-option" + (method === "qr" ? " on" : "")}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qr"
                  checked={method === "qr"}
                  onChange={() => chooseMethod("qr")}
                />
                <span className="payment-check" aria-hidden="true"></span>
                <span>
                  <strong>QR code</strong>
                  <small>Scan and pay with dynamic QR.</small>
                </span>
              </label>
              <label className={"payment-option" + (method === "card" ? " on" : "")}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={method === "card"}
                  onChange={() => chooseMethod("card")}
                />
                <span className="payment-check" aria-hidden="true"></span>
                <span>
                  <strong>Credit card</strong>
                  <small>Enter card details and confirm.</small>
                </span>
              </label>
            </fieldset>
            <button className="btn btn-pay" type="button" disabled={!method} onClick={() => setReadyToPay(true)}>
              Continue
            </button>
          </>
        ) : method === "qr" ? (
          <>
            <div className="payment-detail-head">
              <h1>QR code payment</h1>
              <button className="btn-link" type="button" onClick={() => setReadyToPay(false)}>
                Change option
              </button>
            </div>
            <QrPayment qrUrl={qrUrl} pay={pay} order={order} ttl={ttl} onConfirm={() => onConfirm("QR Payment")} embedded />
          </>
        ) : (
          <>
            <div className="payment-detail-head">
              <h1>Credit card payment</h1>
              <button className="btn-link" type="button" onClick={() => setReadyToPay(false)}>
                Change option
              </button>
            </div>
            <CardPayment pay={pay} order={order} onConfirm={() => onConfirm("Credit Card")} />
          </>
        )}
      </div>
    </section>
  );
}
