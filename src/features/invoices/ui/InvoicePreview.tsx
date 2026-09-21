import { useEffect, useState } from "react";
import { invoiceMarkup, receiptQrSrc } from "../model/invoice";
import type { Invoice } from "../../../types";

export default function InvoicePreview({ invoice, email }: { invoice: Invoice; email: string }) {
  const [html, setHtml] = useState(() => invoiceMarkup(invoice, email, ""));

  useEffect(() => {
    let cancelled = false;
    setHtml(invoiceMarkup(invoice, email, ""));
    receiptQrSrc(invoice).then((qrSrc) => {
      if (!cancelled) setHtml(invoiceMarkup(invoice, email, qrSrc));
    });
    return () => {
      cancelled = true;
    };
  }, [invoice, email]);

  return <div className="invoice-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}
