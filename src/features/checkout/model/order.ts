import { addYears, nonce } from "../../../shared/lib/format";
import { totals } from "./pricing";
import { validTo } from "../../certificates/model/status";
import type { Buyer, Certificate, DurationYears, Invoice, Order, PackageName, Payment, PaymentHistoryRow } from "../../../types";

export function clearCheckoutSession() {
  sessionStorage.removeItem("ca_prototype_payment");
  sessionStorage.removeItem("ca_prototype_order");
  sessionStorage.removeItem("ca_prototype_invoice");
}

interface CreateOrderArgs {
  pkg: PackageName;
  years: DurationYears;
  buyer: Buyer;
  cert: Certificate;
  kind?: Order["kind"];
}

export function createOrder({ pkg, years, buyer, cert, kind = "extend" }: CreateOrderArgs): Order {
  const t = totals(pkg, years);
  const prevExpiry = kind === "issue" ? undefined : validTo(cert);
  return {
    id: "ORD-" + Date.now().toString(36).toUpperCase(),
    pkg,
    years,
    price: t.price,
    tax: t.tax,
    discount: 0,
    total: t.total,
    email: buyer.email,
    phone: buyer.phone,
    firstName: buyer.firstName,
    lastName: buyer.lastName,
    company: buyer.company,
    location: buyer.location,
    city: buyer.city,
    country: buyer.country,
    certId: cert.id,
    commonName: cert.commonName,
    serial: cert.serial,
    kind,
    prevExpiry,
    newExpiry: prevExpiry ? addYears(prevExpiry, years) : undefined,
  };
}

export function createPayment(): Payment {
  return {
    ref: "PSP-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pending" as const,
    nonce: nonce(),
  };
}

export function persistCheckout(order: Order, pay: Payment) {
  sessionStorage.setItem("ca_prototype_order", JSON.stringify(order));
  sessionStorage.setItem("ca_prototype_payment", JSON.stringify(pay));
  sessionStorage.removeItem("ca_prototype_invoice");
  sessionStorage.removeItem("ca_prototype_fulfill");
}

export function qrPayload(pay: Payment, order: Order) {
  return JSON.stringify({
    v: 1,
    type: "ca_prototype.dynamic-qr",
    kind: order.kind,
    ref: pay.ref,
    order: order.id,
    cert: order.serial,
    amount: order.total.toFixed(2),
    currency: "KIP",
    nonce: pay.nonce,
    exp: Date.now() + 15000,
  });
}

export const EMPTY_BUYER: Buyer = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  city: "",
  country: "Lao PDR",
};

export function isBuyerComplete(buyer: Buyer) {
  return Boolean(
    buyer.firstName &&
      buyer.lastName &&
      buyer.email &&
      buyer.phone &&
      buyer.location &&
      buyer.city &&
      buyer.country
  );
}

export function applyPaidOrder(certs: Certificate[], order: Order, invoice: Invoice, paymentRef: string): Certificate[] {
  return certs.map((c) => {
    if (c.id !== order.certId) return c;
    if (order.kind === "issue") {
      return {
        ...c,
        pkg: order.pkg,
        baseYears: order.years,
        extraYears: 0,
        invoiceId: invoice.id,
        paymentRef,
      };
    }
    return {
      ...c,
      extraYears: Number(c.extraYears || 0) + Number(order.years),
      pkg: order.pkg,
      invoiceId: invoice.id,
      paymentRef,
    };
  });
}

export function historyRowFromPaid(order: Order, inv: Invoice, pay: Payment, sessionEmail: string): PaymentHistoryRow {
  return {
    invoiceId: inv.id,
    orderId: order.id,
    pkg: order.pkg,
    years: order.years,
    price: order.price,
    tax: order.tax,
    discount: order.discount || 0,
    total: order.total,
    paymentRef: pay.ref,
    paymentMethod: inv.paymentMethod || "Online Payment",
    paidAt: pay.paidAt || new Date().toISOString(),
    email: order.email || sessionEmail,
    phone: order.phone,
    firstName: order.firstName,
    lastName: order.lastName,
    company: order.company,
    location: order.location,
    city: order.city,
    country: order.country,
    prevExpiry: order.prevExpiry,
    newExpiry: order.newExpiry,
    status: order.kind === "issue" ? "pending" : "activated",
    certSerial: order.serial,
    certId: order.certId,
    commonName: order.commonName,
    kind: order.kind,
  };
}
