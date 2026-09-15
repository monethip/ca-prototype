import QRCode from "qrcode";
import { addYears, fmtDate, money } from "../../../shared/lib/format.js";
import { findCert } from "../../certificates/model/storage.js";
import { validTo } from "../../certificates/model/status.js";

function customerName(email) {
  const local = (email || "customer").split("@")[0];
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buyerDisplayName(o, email) {
  const n = [o && o.firstName, o && o.lastName].filter(Boolean).join(" ").trim();
  if (n) return n;
  if (o && o.company) return o.company;
  return customerName(email);
}

function customerId(email) {
  return "CUS-" + (email || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function invoiceFromHistory(r, certs, email) {
  const total = Number(r.total);
  const price = r.price != null ? Number(r.price) : total / 1.1;
  const tax = r.tax != null ? Number(r.tax) : total - price;
  const cert = findCert(certs, r.certSerial);
  let prevExpiry = r.prevExpiry;
  let newExpiry = r.newExpiry;
  if (!prevExpiry && cert) {
    prevExpiry = r.kind === "issue" ? cert.validFrom : validTo(cert);
  }
  if (!newExpiry && prevExpiry) newExpiry = addYears(prevExpiry, r.years);
  return {
    id: r.invoiceId,
    paymentRef: r.paymentRef,
    issuedAt: r.paidAt,
    paymentMethod: r.paymentMethod || "Online Payment",
    order: {
      pkg: r.pkg,
      years: r.years,
      price,
      tax,
      discount: Number(r.discount || 0),
      total,
      firstName: r.firstName || "",
      lastName: r.lastName || "",
      company: r.company || "",
      location: r.location || "",
      city: r.city || "",
      country: r.country || "",
      email: r.email || email,
      phone: r.phone || "—",
      commonName: r.commonName || (cert && cert.commonName) || "—",
      serial: r.certSerial || "—",
      certId: r.certId || (cert && cert.id) || r.certSerial || "—",
      kind: r.kind,
      prevExpiry,
      newExpiry,
    },
  };
}

export async function receiptQrSrc(inv) {
  return QRCode.toDataURL("CA-RECEIPT|" + inv.id + "|" + inv.paymentRef, {
    width: 148,
    margin: 1,
    color: { dark: "#181d26", light: "#ffffff" },
  });
}

export function invoiceMarkup(inv, sessionEmail, qrSrc) {
  const o = inv.order;
  const yearsLabel = o.years + (Number(o.years) === 1 ? " Year" : " Years");
  const amt = (n) => money(Number(n)) + " KIP";
  const desc = o.kind === "issue" ? "CA Certificate Issue" : "CA Validity Extension";
  const qrImg = qrSrc
    ? "<img src='" +
      qrSrc +
      "' width='148' height='148' alt='QR for checking receipt' />"
    : "";
  return (
    "<article class='receipt'>" +
    "<p class='receipt-kicker'>Invoice / Payment Receipt — CA Validity Extension</p>" +
    "<div class='receipt-brand'><div class='receipt-logo' aria-hidden='true'></div><div>" +
    "<h2>CA - Prototype</h2>" +
    "<p>Certificate Authority Services</p>" +
    "<p>Vientiane Capital, Lao PDR</p>" +
    "<p>+856 21 000 000 | billing@ca-prototype.example | ca-prototype.example</p>" +
    "</div></div>" +
    "<h2 class='receipt-title'>PAYMENT INVOICE / RECEIPT</h2>" +
    "<table class='receipt-meta'>" +
    "<tr><td>Invoice No.</td><td>" + inv.id + "</td></tr>" +
    "<tr><td>Invoice Date</td><td>" + fmtDate(inv.issuedAt) + "</td></tr>" +
    "<tr><td>Payment Status</td><td><span class='receipt-paid'>PAID</span></td></tr>" +
    "<tr><td>Payment Date</td><td>" + fmtDate(inv.issuedAt) + "</td></tr>" +
    "</table>" +
    "<h3>BILL TO</h3>" +
    "<table class='receipt-dl'>" +
    "<tr><td>Customer Name</td><td>" + buyerDisplayName(o, sessionEmail) + "</td></tr>" +
    "<tr><td>Customer ID</td><td>" + customerId(sessionEmail) + "</td></tr>" +
    (o.company ? "<tr><td>Company</td><td>" + o.company + "</td></tr>" : "") +
    "<tr><td>Email</td><td>" + (o.email || sessionEmail) + "</td></tr>" +
    "<tr><td>Phone</td><td>" + (o.phone || "—") + "</td></tr>" +
    "<tr><td>Location</td><td>" + (o.location || "—") + "</td></tr>" +
    "<tr><td>City</td><td>" + (o.city || "—") + "</td></tr>" +
    "<tr><td>Country</td><td>" + (o.country || "—") + "</td></tr>" +
    "</table>" +
    "<h3>SERVICE DETAILS</h3>" +
    "<table class='receipt-lines'><thead><tr>" +
    "<th>Description</th><th>Validity Period</th><th>Quantity</th><th>Unit Price</th><th>Amount</th>" +
    "</tr></thead><tbody><tr>" +
    "<td>" + desc + " (" + o.pkg + ")</td><td>" + yearsLabel + "</td><td>1</td>" +
    "<td>" + amt(o.price) + "</td><td>" + amt(o.price) + "</td>" +
    "</tr></tbody></table>" +
    "<table class='receipt-totals'>" +
    "<tr><td>Subtotal</td><td>" + amt(o.price) + "</td></tr>" +
    "<tr><td>Discount</td><td>" + amt(o.discount || 0) + "</td></tr>" +
    "<tr><td>Tax</td><td>" + amt(o.tax) + "</td></tr>" +
    "<tr><td>Total Paid</td><td>" + amt(o.total) + "</td></tr>" +
    "</table>" +
    "<div class='receipt-check'>" +
    "<div>" +
    "<h3>CERTIFICATE DETAILS</h3>" +
    "<table class='receipt-dl'>" +
    "<tr><td>Certificate / CA Name</td><td>" + o.commonName + "</td></tr>" +
    "<tr><td>Certificate ID</td><td>" + o.serial + "</td></tr>" +
    "<tr><td>Previous Expiry Date</td><td>" + fmtDate(o.prevExpiry) + "</td></tr>" +
    "<tr><td>New Expiry Date</td><td>" + fmtDate(o.newExpiry) + "</td></tr>" +
    "<tr><td>Extension Period</td><td>" + yearsLabel + "</td></tr>" +
    "</table>" +
    "<h3>PAYMENT INFORMATION</h3>" +
    "<table class='receipt-dl'>" +
    "<tr><td>Payment Method</td><td>" + (inv.paymentMethod || "Online Payment") + "</td></tr>" +
    "<tr><td>Transaction ID</td><td>" + inv.paymentRef + "</td></tr>" +
    "<tr><td>Payment Status</td><td><span class='receipt-paid'>Paid</span></td></tr>" +
    "</table>" +
    "<p class='receipt-note'>Thank you for your payment. Your CA validity has been successfully extended.</p>" +
    "<p class='receipt-sign'>Issued by: CA - Prototype</p>" +
    "<p class='receipt-sign'>Authorized by: Certificate Operations / Head of CA Services</p>" +
    "</div>" +
    "<div class='receipt-check-side'>" +
    "<p class='receipt-total-paid'><span>Total Paid</span><strong>" + amt(o.total) + "</strong></p>" +
    "<aside class='receipt-qr'>" +
    qrImg +
    "<p class='receipt-qr-caption'>QR for checking receipt</p>" +
    "</aside>" +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

export async function downloadInvoiceHtml(inv, sessionEmail) {
  const qrSrc = await receiptQrSrc(inv);
  const blob = new Blob(
    [
      "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" +
        inv.id +
        "</title><style>body{padding:32px;background:#fff;font-family:Inter,sans-serif;color:#181d26} .receipt{max-width:760px;margin:0 auto;border:1px solid #ddd;border-radius:8px;padding:32px 36px} .receipt h2,.receipt h3{color:#181d26} .receipt h3{margin:24px 0 10px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.04em} .receipt-title{margin:0 0 16px;font-size:22px;font-weight:500} .receipt-brand p,.receipt-note,.receipt-sign,.receipt-meta td:first-child,.receipt-dl td:first-child,.receipt-totals td:first-child,.receipt-lines th,.receipt-total-paid span{color:#666} table{width:100%;border-collapse:collapse} td,th{padding:8px 0;text-align:left} .receipt-paid{color:#006400;font-weight:500} .receipt-logo{width:48px;height:48px;background:#181d26;border-radius:6px} .receipt-brand{display:flex;gap:16px;border-bottom:2px solid #181d26;padding-bottom:20px;margin-bottom:24px} .receipt-lines{width:100%;margin:8px 0 12px;border-collapse:collapse} .receipt-lines th,.receipt-lines td{padding:10px 8px;border-bottom:1px solid #ddd;text-align:left} .receipt-lines th{font-weight:500;font-size:13px} .receipt-lines th:nth-child(3),.receipt-lines td:nth-child(3),.receipt-lines th:nth-child(4),.receipt-lines td:nth-child(4),.receipt-lines th:nth-child(5),.receipt-lines td:nth-child(5){text-align:right} .receipt-totals{width:280px;margin-left:auto;border-collapse:collapse} .receipt-totals td{padding:8px 0} .receipt-totals td:last-child{text-align:right} .receipt-totals tr:last-child td{font-weight:500;border-top:1px solid #181d26;padding-top:12px} .receipt-check{display:grid;grid-template-columns:1fr 200px;gap:24px;align-items:start} .receipt-total-paid{display:flex;justify-content:space-between;gap:12px;margin:0 0 12px;font-size:14px} .receipt-qr{padding:14px 12px;text-align:center} .receipt-qr img{display:block;margin:8px auto;background:#fff;padding:4px} .receipt-qr-name{margin:0;font-size:12px;font-weight:500} .receipt-qr-caption{margin:8px 0 0;font-size:13px;font-weight:500}</style></head><body>" +
        invoiceMarkup(inv, sessionEmail, qrSrc) +
        "</body></html>",
    ],
    { type: "text/html" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = inv.id + ".html";
  a.click();
  URL.revokeObjectURL(a.href);
}
