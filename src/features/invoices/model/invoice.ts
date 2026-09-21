import QRCode from "qrcode";
import { addYears, fmtDate } from "../../../shared/lib/format";
import { findCert } from "../../certificates/model/storage";
import { validTo } from "../../certificates/model/status";
import type { Certificate, Invoice, Order, PaymentHistoryRow } from "../../../types";

function customerName(email: string) {
  const local = (email || "customer").split("@")[0];
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buyerDisplayName(o: Partial<Order> | undefined, email: string) {
  if (o && o.company) return o.company;
  const n = [o && o.firstName, o && o.lastName].filter(Boolean).join(" ").trim();
  if (n) return n;
  return customerName(email);
}

function lak(n: number) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function fmtRange(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = String(d.getDate()).padStart(2, "0");
  return months[d.getMonth()] + " " + dd + "," + d.getFullYear();
}

const LOGO_SVG =
  "<svg class='lc-logo' viewBox='0 0 72 56' width='72' height='56' aria-hidden='true'>" +
  "<path fill='#3db4d0' d='M36 6c12 0 22 8 26 18-4-2-9-3-14-3-10 0-18 5-22 13C24 20 29 6 36 6z'/>" +
  "<path fill='#1e8fb0' d='M18 20c8-8 20-10 30-6-8 2-14 8-16 16-4-5-9-8-14-10z'/>" +
  "<path fill='#7fd4e6' d='M44 18c8 2 14 8 16 16-6-4-14-6-22-4 2-5 4-9 6-12z'/>" +
  "</svg>";

export function invoiceFromHistory(r: PaymentHistoryRow, certs: Certificate[], email: string): Invoice {
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
      id: r.orderId,
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

export async function receiptQrSrc(inv: Invoice) {
  return QRCode.toDataURL("CA-RECEIPT|" + inv.id + "|" + inv.paymentRef, {
    width: 128,
    margin: 1,
    color: { dark: "#181d26", light: "#ffffff" },
  });
}

export function invoiceMarkup(inv: Invoice, sessionEmail: string, qrSrc = "") {
  const o = inv.order;
  const from = o.kind === "extend" ? o.prevExpiry : inv.issuedAt;
  const to = o.newExpiry || (from ? addYears(from, o.years) : "");
  const desc =
    "Softkey Digital Stamp laosofkey RSSP<br>(" + fmtRange(from) + " to " + fmtRange(to) + ")";
  const qty = 1;
  const unit = o.price;
  const amount = o.price;
  return (
    "<article class='receipt lc-invoice'>" +
    "<header class='lc-head'>" +
    "<div class='lc-issuer'>" +
    // LOGO_SVG +
    "<p class='lc-brand-name'>Lao Connect</p>" +
    "<p>LAO CONNECT CO.,LTD</p>" +
    "<p>Phonsa-Art Village, SAYSETTA DISTRICT</p>" +
    "<p>VIENTIANE LAO PDR , TEL : +856 21 264 918.</p>" +
    "</div>" +
    "<div class='lc-meta-wrap'>" +
    "<h2 class='lc-title'>INVOICE</h2>" +
    "<table class='lc-meta'>" +
    "<tr><th>INVOICE NO:</th><td>" + inv.id + "</td></tr>" +
    "<tr><th>ISSUE DATE:</th><td>" + fmtDate(inv.issuedAt) + "</td></tr>" +
    "<tr><th>DUE DATE:</th><td>" + fmtDate(addDays(inv.issuedAt, 15)) + "</td></tr>" +
    "</table>" +
    "</div>" +
    "</header>" +
    "<p class='lc-to'><strong>To:</strong> " + buyerDisplayName(o, sessionEmail) + "</p>" +
    "<table class='lc-lines'>" +
    "<thead><tr>" +
    "<th class='lc-no'>NO.</th><th>DESCRIPTION</th><th>QTY</th><th>PRICE</th><th>AMOUNT (LAK)</th>" +
    "</tr></thead>" +
    "<tbody><tr>" +
    "<td class='lc-no'>1</td>" +
    "<td class='lc-desc'>" + desc + "</td>" +
    "<td>" + qty + "</td>" +
    "<td>" + lak(unit) + "</td>" +
    "<td>" + lak(amount) + "</td>" +
    "</tr></tbody>" +
    "</table>" +
    "<table class='lc-totals'>" +
    "<tr><th>SUBTOTAL</th><td>" + lak(o.price) + "</td></tr>" +
    "<tr><th>VAT 10%</th><td>" + lak(o.tax) + "</td></tr>" +
    "<tr><th>TOTAL of LAK</th><td>" + lak(o.total) + "</td></tr>" +
    "</table>" +
    "<div class='lc-foot'>" +
    "<div class='lc-pay'>" +
    "<p><strong>Payment detail:</strong></p>" +
    "<p>Money transfer to the account below:</p>" +
    "<table>" +
    "<tr><td>Bank:</td><td>BIC BANK LAO CO.,LTD</td></tr>" +
    "<tr><td>Account name:</td><td>LAO CONNECT CO.,LTD</td></tr>" +
    "<tr><td>Account No:</td><td>800010100006246</td></tr>" +
    "<tr><td>Currency:</td><td>LAK</td></tr>" +
    "</table>" +
    "<aside class='lc-qr'>" +
    (qrSrc
      ? "<img src='" + qrSrc + "' width='128' height='128' alt='QR for checking receipt' />"
      : "<div class='lc-qr-placeholder'></div>") +
    "<p>QR for checking receipt</p>" +
    "</aside>" +
    "</div>" +
    "<div class='lc-auth'>" +
    "<p class='lc-auth-label'>Authorized by,</p>" +
    "<div class='lc-stamp'>" +
    // "Example stamp" +
    "<span class='lc-sign'>Signing</span>" +
    "</div>" +
    "<p class='lc-role'>Financial Director</p>" +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

const DOWNLOAD_CSS =
  "body{margin:0;padding:24px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#111}" +
  ".lc-invoice{max-width:760px;margin:0 auto;padding:28px 32px;background:#fff;color:#111}" +
  ".lc-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:28px}" +
  ".lc-issuer p{margin:0;font-size:12px;line-height:1.45}" +
  ".lc-brand-name{color:#2aa3c7;font-weight:700;font-size:15px!important;margin-top:4px!important}" +
  ".lc-logo{display:block}" +
  ".lc-meta-wrap{min-width:260px;text-align:right}" +
  ".lc-title{margin:0 0 10px;font-size:22px;font-weight:700;letter-spacing:.04em}" +
  ".lc-meta{width:100%;border-collapse:collapse;font-size:12px}" +
  ".lc-meta th,.lc-meta td{border:1px solid #7ec9d8;padding:6px 10px;text-align:left}" +
  ".lc-meta th{background:#7ec9d8;color:#fff;font-weight:700;width:46%}" +
  ".lc-to{margin:0 0 18px;font-size:13px}" +
  ".lc-lines{width:100%;border-collapse:collapse;font-size:12px}" +
  ".lc-lines th,.lc-lines td{border:1px solid #111;padding:8px 10px;vertical-align:top}" +
  ".lc-lines th{background:#f3f3f3;font-weight:700;text-align:center}" +
  ".lc-lines td{text-align:center}" +
  ".lc-lines .lc-desc{text-align:left;min-height:220px;height:220px}" +
  ".lc-lines .lc-no{width:48px}" +
  ".lc-totals{width:280px;margin:0 0 0 auto;border-collapse:collapse;font-size:12px}" +
  ".lc-totals th,.lc-totals td{border:1px solid #111;padding:7px 10px}" +
  ".lc-totals th{text-align:right;font-weight:700;width:55%}" +
  ".lc-totals td{text-align:right}" +
  ".lc-foot{display:flex;justify-content:space-between;align-items:flex-start;margin-top:28px;gap:24px}" +
  ".lc-pay p{margin:0 0 6px;font-size:13px}" +
  ".lc-pay table{border-collapse:collapse;font-size:12px}" +
  ".lc-pay td{padding:2px 16px 2px 0}" +
  ".lc-qr{margin-top:16px;text-align:left}" +
  ".lc-qr img{display:block;width:128px;height:128px}" +
  ".lc-qr p{margin:8px 0 0;font-size:12px;font-weight:700}" +
  ".lc-auth{text-align:center;min-width:180px}" +
  ".lc-auth-label{margin:0 0 8px;font-size:13px}" +
  ".lc-stamp{position:relative;width:140px;height:140px;margin:0 auto;overflow:hidden;border-radius:50%}" +
  ".lc-sign{position:absolute;left:18px;top:58px;font-style:italic;font-size:22px;color:#1a1a1a;transform:rotate(-8deg)}" +
  ".lc-role{margin:4px 0 0;font-size:13px}";

export async function downloadInvoiceHtml(inv: Invoice, sessionEmail: string) {
  const qrSrc = await receiptQrSrc(inv);
  const blob = new Blob(
    [
      "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" +
        inv.id +
        "</title><style>" +
        DOWNLOAD_CSS +
        "</style></head><body>" +
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
