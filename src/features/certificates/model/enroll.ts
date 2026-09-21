import type { Certificate, EnrollForm } from "../../../types";

export const EMPTY_ENROLL: EnrollForm = {
  phone: "",
  email: "",
  purpose: "personal",
  authMode: "pin",
  activityDeclarationPhoto: "",
  businessLicense: "",
  idCardPhoto: "",
  serviceRegistrationDocument: "",
  handoverMinutes: "",
  identityType: "",
  identityNumber: "",
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

export function hasRequiredUploads(form: EnrollForm) {
  return Boolean(
    form.activityDeclarationPhoto &&
    form.businessLicense &&
    form.idCardPhoto &&
    form.serviceRegistrationDocument &&
    form.handoverMinutes
  );
}

export function enrollToCert(form: EnrollForm): Certificate {
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
