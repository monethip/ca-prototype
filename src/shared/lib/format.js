export function addYears(iso, years) {
  const d = new Date(iso);
  d.setFullYear(d.getFullYear() + Number(years));
  return d.toISOString();
}

export function fmt(iso) {
  return iso.replace("T", " ").slice(0, 19);
}

export function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return dd + "/" + mm + "/" + d.getFullYear();
}

export function money(n) {
  return Number(n).toFixed(2);
}

export function nonce() {
  return Math.random().toString(36).slice(2, 10);
}
