import { downloadInvoiceHtml, invoiceMarkup } from "../model/invoice.js";

export default function InvoiceView({ invoice, email, onBack }) {
  return (
    <section className="view on">
      <div className="invoice-page">
        <p className="step-kicker">04 / INVOICE</p>
        <h1>Invoice generation and export</h1>
        <p className="lede">
          Payment confirmation wrote this invoice automatically. Download it below. Certificate activation is handled on
          the backend.
        </p>
        <div id="invoiceBox" dangerouslySetInnerHTML={{ __html: invoiceMarkup(invoice, email) }} />
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
