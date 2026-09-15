import { useEffect, useState } from "react";
import { downloadInvoiceHtml, invoiceMarkup, receiptQrSrc } from "../model/invoice.js";

export default function InvoiceView({ invoice, email, onBack }) {
  const [html, setHtml] = useState(() => invoiceMarkup(invoice, email, ""));

  useEffect(() => {
    let cancelled = false;
    receiptQrSrc(invoice).then((qrSrc) => {
      if (!cancelled) setHtml(invoiceMarkup(invoice, email, qrSrc));
    });
    return () => {
      cancelled = true;
    };
  }, [invoice, email]);

  return (
    <section className="view on">
      <div className="invoice-page">
        <p className="step-kicker">04 / INVOICE</p>
        <h1>Invoice generation and export</h1>
        <p className="lede">
          Payment confirmation wrote this invoice automatically. Download it below. Certificate activation is handled on
          the backend.
        </p>
        <div id="invoiceBox" dangerouslySetInnerHTML={{ __html: html }} />
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
