import type { Order, Payment } from "../../../types";

interface QrPaymentProps {
  qrUrl: string;
  pay: Payment;
  order: Order;
  ttl: number;
  onConfirm: () => void;
  embedded?: boolean;
}

export default function QrPayment({ qrUrl, pay, order, ttl, onConfirm, embedded }: QrPaymentProps) {
  const body = (
    <>
      {!embedded && (
        <>
          <p className="step-kicker">03 / PAYMENT</p>
          <h1>Scan the dynamic QR</h1>
        </>
      )}
      <p className="lede">
        The code refreshes so it cannot be reused after expiry. Pay the amount shown, then wait for confirmation.
      </p>
      <div className="pay-row">
        <div className="qr-stage">
          <div id="qrHost">{qrUrl ? <img src={qrUrl} alt="Payment QR code" width={232} height={232} /> : null}</div>
        </div>
        <div>
          <p className="meta">
            Payment reference <strong>{pay.ref}</strong>
          </p>
          <p className="meta">
            Amount <strong>{order.total.toFixed(2)} KIP</strong>
          </p>
          <p className="meta">
            QR refreshes in <strong>{ttl}</strong>s
          </p>
          {pay.status === "paid" && <p className="ok">Payment confirmed. Invoice is being generated.</p>}
          <div className="actions" style={{ justifyContent: "center" }}>
            <button className="btn btn-pay" type="button" disabled={pay.status === "paid"} onClick={onConfirm}>
              Confirm payment success
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) return <div className="qr-embed">{body}</div>;

  return (
    <section className="view on">
      <div className="qr-card">{body}</div>
    </section>
  );
}
