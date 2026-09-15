export const MOCK_HISTORY = [
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

export function defaultHistory(email) {
  return MOCK_HISTORY.map((h) => ({ ...h, email }));
}

function historyStore() {
  try {
    return JSON.parse(localStorage.getItem(histKey()) || "{}");
  } catch {
    return {};
  }
}

export function userHistory(email) {
  const all = historyStore();
  const key = email.toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(all, key)) {
    all[key] = defaultHistory(email);
    localStorage.setItem(histKey(), JSON.stringify(all));
  }
  return all[key];
}

export function writeHistory(email, rows) {
  const all = historyStore();
  all[email.toLowerCase()] = rows;
  localStorage.setItem(histKey(), JSON.stringify(all));
}
