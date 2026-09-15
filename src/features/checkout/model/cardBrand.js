const BRANDS = {
  visa: { name: "Visa", color: "#1a1f71" },
  mastercard: { name: "Mastercard", color: "#eb001b" },
  amex: { name: "American Express", color: "#006fcf" },
  discover: { name: "Discover", color: "#ff6000" },
  jcb: { name: "JCB", color: "#0e4c96" },
  unionpay: { name: "UnionPay", color: "#00447c" },
  unknown: { name: "Card", color: "#9aa3af" },
};

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function detectCardBrand(number) {
  const d = digitsOnly(number);
  if (!d) return "unknown";
  if (/^4/.test(d)) return "visa";
  if (/^3[47]/.test(d)) return "amex";
  if (/^35/.test(d)) return "jcb";
  if (/^62/.test(d)) return "unionpay";
  if (/^(6011|65|64[4-9])/.test(d)) return "discover";
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(d)) return "mastercard";
  if (d.length === 1) return "unknown";
  return "unknown";
}

export function brandMeta(brand) {
  return BRANDS[brand] || BRANDS.unknown;
}

export function formatCardNumber(value) {
  const d = digitsOnly(value).slice(0, 19);
  const brand = detectCardBrand(d);
  if (brand === "amex") {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  }
  return d.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value) {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + " / " + d.slice(2);
}

export function isCardComplete({ number, name, expiry, cvc }) {
  const brand = detectCardBrand(number);
  const d = digitsOnly(number);
  const minLen = brand === "amex" ? 15 : 16;
  const cvcLen = brand === "amex" ? 4 : 3;
  return d.length >= minLen && name.trim().length > 1 && digitsOnly(expiry).length === 4 && digitsOnly(cvc).length >= cvcLen;
}
