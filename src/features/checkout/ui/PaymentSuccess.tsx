import { downloadInvoiceHtml } from "../../invoices/model/invoice";
import InvoicePreview from "../../invoices/ui/InvoicePreview";
import type { Invoice, Order } from "../../../types";

interface PaymentSuccessProps {
  invoice: Invoice;
  email: string;
  order: Order | null;
  onCerts: () => void;
}

export default function PaymentSuccess({ invoice, email, order, onCerts }: PaymentSuccessProps) {
  return (
    <section className="view on payment-success">
      <div className="payment-success-head">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <p className="step-kicker">PAYMENT SUCCESS</p>
        <h1>Payment successful</h1>
        <p className="lede">
          {order?.kind === "issue"
            ? "Your payment is confirmed. Your certificate request is pending review."
            : "Your payment is confirmed and the certificate validity has been extended. You can go back to your certificates or download the invoice."}
        </p>
        <p className="meta">
          Reference <strong>{invoice.paymentRef}</strong>
          {" · "}
          {order?.pkg} · {order?.years}-year
          {" · "}
          <strong>{order?.total?.toFixed(2)} KIP</strong>
        </p>
      </div>
      <InvoicePreview invoice={invoice} email={email} />
      <div className="invoice-actions payment-success-actions">
        <button className="btn btn-secondary" type="button" onClick={onCerts}>
          Back to certificates
        </button>
        <button className="btn btn-pay" type="button" onClick={() => downloadInvoiceHtml(invoice, email)}>
          Download invoice
        </button>
      </div>
    </section>
  );
}
