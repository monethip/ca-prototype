import { downloadInvoiceHtml } from "../../invoices/model/invoice.js";

export default function PaymentSuccess({ invoice, email, order, onCerts }) {
  return (
    <section className="view on">
      <div className="success-card">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <p className="step-kicker">PAYMENT SUCCESS</p>
        <h1>Payment successful</h1>
        <p className="lede">
          Your payment is confirmed and the certificate validity has been extended. You can go back to your certificates
          or download the invoice.
        </p>
        <p className="meta">
          Reference <strong>{invoice.paymentRef}</strong>
          {" · "}
          {order?.pkg} · {order?.years}-year
          {" · "}
          <strong>{order?.total?.toFixed(2)} KIP</strong>
        </p>
        <div className="invoice-actions" style={{ marginTop: 28, justifyContent: "center" }}>
          <button className="btn btn-secondary" type="button" onClick={onCerts}>
            Back to certificates
          </button>
          <button className="btn btn-pay" type="button" onClick={() => downloadInvoiceHtml(invoice, email)}>
            Download invoice
          </button>
        </div>
      </div>
    </section>
  );
}
