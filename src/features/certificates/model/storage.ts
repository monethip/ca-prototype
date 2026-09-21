import type { Certificate } from "../../../types";

export const MOCK_CERTS: Certificate[] = [
  {
    id: "c4",
    serial: "CA-EXPIRE01",
    commonName: "gateway.expired.example",
    pkg: "Standard",
    status: "Expired",
    issuer: "Existing CA via CA - Prototyp",
    keyUsage: "Digital signature, Key encipherment",
    invoiceId: "INV-55012",
    paymentRef: "PSP-9Q1EXP",
    issuedAt: "2025-03-01T08:00:00.000Z",
    validFrom: "2025-03-01T08:00:00.000Z",
    baseYears: 1,
    extraYears: 0,
  },
];

function certKey(email: string) {
  return "ca_prototype_certs_v1_" + email.toLowerCase();
}

export function defaultCerts(): Certificate[] {
  return MOCK_CERTS.map((c) => ({ ...c }));
}

export function loadCerts(email: string): Certificate[] {
  const raw = localStorage.getItem(certKey(email));
  if (raw != null) {
    try {
      const rows = JSON.parse(raw);
      if (Array.isArray(rows)) return rows as Certificate[];
    } catch {
      /* ignore */
    }
  }
  const seeded = defaultCerts();
  localStorage.setItem(certKey(email), JSON.stringify(seeded));
  return seeded;
}

export function initEmptyCerts(email: string): Certificate[] {
  localStorage.setItem(certKey(email), JSON.stringify([]));
  return [];
}

export function saveCerts(email: string, rows: Certificate[]) {
  localStorage.setItem(certKey(email), JSON.stringify(rows));
}

export function findCert(certs: Certificate[], serial: string) {
  return certs.find((c) => c.serial === serial) || null;
}
