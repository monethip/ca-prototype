export type ActorTab = "sub" | "ca" | "portal" | "psp";

export const ACTOR_COPY: Record<ActorTab, { meta: string; title: string; body: string }> = {
  sub: {
    meta: "Actor",
    title: "Logs in, configures, pays, and downloads the invoice",
    body: "The subscriber signs in on the CA - Prototype login page, then picks Standard or Premium and a 1- or 2-year term, completes QR or link checkout, and exports the invoice. There is no sign-up and no SSO.",
  },
  ca: {
    meta: "Actor",
    title: "Entitlements and certificate issue",
    body: "After payment, the CA receives a payment reference and activates the package and duration. Identity for the portal is the login page, not SSO on the CA.",
  },
  portal: {
    meta: "Actor",
    title: "Login, catalog, invoice, webhook, activation call",
    body: "CA - Prototype authenticates on the login page, prices the order, creates the PSP transaction, listens for confirmation, generates the invoice, and calls the CA to provision.",
  },
  psp: {
    meta: "Actor",
    title: "QR, payment link, capture, callback",
    body: "The payment gateway creates the transaction, presents QR or a link, verifies funds, and notifies the portal. Payment truth lives here — not in the CA.",
  },
};
