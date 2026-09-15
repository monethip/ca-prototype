import { addYears, nonce } from "../../../shared/lib/format.js";
import { totals } from "./pricing.js";
import { validTo } from "../../certificates/model/status.js";

export function clearCheckoutSession() {
  sessionStorage.removeItem("ca_prototype_payment");
  sessionStorage.removeItem("ca_prototype_order");
  sessionStorage.removeItem("ca_prototype_invoice");
}

export function createOrder({ pkg, years, buyer, cert }) {
  const t = totals(pkg, years);
  const prevExpiry = validTo(cert);
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
    kind: "extend",
    prevExpiry,
    newExpiry: addYears(prevExpiry, years),
  };
}

export function createPayment() {
  return {
    ref: "PSP-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pending",
    nonce: nonce(),
  };
}

export function persistCheckout(order, pay) {
  sessionStorage.setItem("ca_prototype_order", JSON.stringify(order));
  sessionStorage.setItem("ca_prototype_payment", JSON.stringify(pay));
  sessionStorage.removeItem("ca_prototype_invoice");
  sessionStorage.removeItem("ca_prototype_fulfill");
}

export function qrPayload(pay, order) {
  return JSON.stringify({
    v: 1,
    type: "ca_prototype.dynamic-qr",
    kind: "extend",
    ref: pay.ref,
    order: order.id,
    cert: order.serial,
    amount: order.total.toFixed(2),
    currency: "KIP",
    nonce: pay.nonce,
    exp: Date.now() + 15000,
  });
}

export const EMPTY_BUYER = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  city: "",
  country: "Lao PDR",
};

export function isBuyerComplete(buyer) {
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

export function applyPaidOrder(certs, order, invoice, paymentRef) {
  return certs.map((c) => {
    if (c.id !== order.certId) return c;
    return {
      ...c,
      extraYears: Number(c.extraYears || 0) + Number(order.years),
      pkg: order.pkg,
      invoiceId: invoice.id,
      paymentRef,
    };
  });
}

export function historyRowFromPaid(order, inv, pay, sessionEmail) {
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
    paidAt: pay.paidAt,
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
    status: "activated",
    certSerial: order.serial,
    commonName: order.commonName,
    kind: "extend",
  };
}
