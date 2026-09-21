import type { ReactNode } from "react";

export type PackageName = "Standard" | "Premium";
export type DurationYears = 1 | 2;

export type CertificateStatus = "Active" | "Expired" | "Pending" | string;

export interface EnrollForm {
  phone: string;
  email: string;
  purpose: string;
  authMode: string;
  activityDeclarationPhoto: string;
  businessLicense: string;
  idCardPhoto: string;
  serviceRegistrationDocument: string;
  handoverMinutes: string;
  identityType: "" | "pid" | "ppid";
  identityNumber: string;
  personalName: string;
  tin: string;
  organization: string;
  organizationUnit: string;
  title: string;
  locality: string;
  state: string;
  username: string;
  pkg: PackageName;
  years: DurationYears;
}

export interface Certificate {
  id: string;
  serial: string;
  commonName: string;
  pkg: PackageName;
  status: CertificateStatus;
  issuer: string;
  keyUsage: string;
  invoiceId: string;
  paymentRef: string;
  issuedAt: string;
  validFrom: string;
  baseYears: number;
  extraYears: number;
  pending?: boolean;
  enroll?: EnrollForm;
}

export interface Buyer {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  country: string;
}

export interface Order extends Buyer {
  id: string;
  pkg: PackageName;
  years: DurationYears;
  price: number;
  tax: number;
  discount: number;
  total: number;
  certId: string;
  commonName: string;
  serial: string;
  kind: "extend" | "issue";
  prevExpiry?: string;
  newExpiry?: string;
}

export interface Payment {
  ref: string;
  status: "pending" | "paid";
  nonce: string;
  paidAt?: string;
}

export interface Invoice {
  id: string;
  order: Order;
  paymentRef: string;
  issuedAt: string;
  paymentMethod?: string;
}

export interface PaymentHistoryRow {
  invoiceId: string;
  orderId: string;
  pkg: PackageName;
  years: DurationYears;
  price?: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentRef: string;
  paymentMethod?: string;
  paidAt: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  location?: string;
  city?: string;
  country?: string;
  prevExpiry?: string;
  newExpiry?: string;
  status: string;
  certSerial: string;
  certId?: string;
  commonName: string;
  kind: "extend" | "issue";
}

export interface Session {
  username: string;
  email: string;
  token: string;
  issuedAt: string;
  isNew: boolean;
}

export type PortalView =
  | "certs"
  | "pricing"
  | "history"
  | "package"
  | "billing"
  | "qr"
  | "success"
  | "invoice"
  | "register";

export type VoidHandler = () => void;
export type ChildrenProps = { children: ReactNode };
