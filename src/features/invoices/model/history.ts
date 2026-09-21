import type { PaymentHistoryRow } from "../../../types";

export const MOCK_HISTORY: PaymentHistoryRow[] = [
  {
    invoiceId: "INV-55012",
    orderId: "ORD-EXPIRE01",
    pkg: "Standard",
    years: 1,
    total: 132,
    paymentRef: "PSP-9Q1EXP",
    paidAt: "2025-03-01T08:00:00.000Z",
    email: "",
    status: "activated",
    certSerial: "CA-EXPIRE01",
    commonName: "gateway.expired.example",
    kind: "issue",
  },
];

function histKey() {
  return "ca_prototype_paid_history_v1";
}

type HistoryStore = Record<string, PaymentHistoryRow[]>;

export function defaultHistory(email: string): PaymentHistoryRow[] {
  return MOCK_HISTORY.map((h) => ({ ...h, email }));
}

function historyStore(): HistoryStore {
  try {
    return JSON.parse(localStorage.getItem(histKey()) || "{}") as HistoryStore;
  } catch {
    return {};
  }
}

export function userHistory(email: string): PaymentHistoryRow[] {
  const all = historyStore();
  const key = email.toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(all, key)) {
    all[key] = defaultHistory(email);
    localStorage.setItem(histKey(), JSON.stringify(all));
  }
  return all[key];
}

export function writeHistory(email: string, rows: PaymentHistoryRow[]) {
  const all = historyStore();
  all[email.toLowerCase()] = rows;
  localStorage.setItem(histKey(), JSON.stringify(all));
}
