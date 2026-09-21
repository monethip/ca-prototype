export function addYears(iso: string, years: number) {
  const d = new Date(iso);
  d.setFullYear(d.getFullYear() + Number(years));
  return d.toISOString();
}

export function fmt(iso: string) {
  return iso.replace("T", " ").slice(0, 19);
}

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return dd + "/" + mm + "/" + d.getFullYear();
}

export function money(n: number) {
  return Number(n).toFixed(2);
}

export function nonce() {
  return Math.random().toString(36).slice(2, 10);
}
