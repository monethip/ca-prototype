import { downloadInvoiceHtml } from "../model/invoice";
import type { Invoice } from "../../../types";
import InvoicePreview from "./InvoicePreview";

interface InvoiceViewProps {
  invoice: Invoice;
  email: string;
  onBack: () => void;
}

export default function InvoiceView({ invoice, email, onBack }: InvoiceViewProps) {
  return (
    <section className="view on">
      <div className="invoice-page">
        <p className="step-kicker">04 / INVOICE</p>
        <h1>Invoice generation and export</h1>
        <p className="lede">
          Payment confirmation wrote this invoice automatically. Download it below. Certificate activation is handled on
          the backend.
        </p>
        <InvoicePreview invoice={invoice} email={email} />
        <div className="actions">
          <button className="btn btn-secondary" type="button" onClick={onBack}>
            Back to certificates
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => downloadInvoiceHtml(invoice, email)}>
            Download invoice
          </button>
        </div>
      </div>
    </section>
  );
}
