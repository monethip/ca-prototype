export const EMPTY_ENROLL = {
  phone: "",
  email: "",
  purpose: "personal",
  authMode: "pin",
  attachDoc: "",
  identityDoc: "",
  personalName: "",
  tin: "",
  organization: "",
  organizationUnit: "",
  title: "",
  locality: "",
  state: "",
  username: "",
  pkg: "Premium",
  years: 1,
};

export function enrollToCert(form) {
  const now = new Date().toISOString();
  const serial = "CA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    id: "c-" + Date.now().toString(36),
    serial,
    commonName: form.personalName || form.username || form.email,
    pkg: form.pkg || (form.purpose === "enterprise" ? "Premium" : "Standard"),
    status: "Pending",
    pending: true,
    issuer: "Enrollment request",
    keyUsage: form.authMode === "tse" ? "TSE authentication" : "PIN authentication",
    invoiceId: "—",
    paymentRef: "—",
    issuedAt: now,
    validFrom: now,
    baseYears: Number(form.years) || 1,
    extraYears: 0,
    enroll: { ...form },
  };
}
