export const RATES = { Standard: { 1: 120.0, 2: 200.0 }, Premium: { 1: 240.0, 2: 400.0 } };

export function totals(pkg, years) {
  const price = RATES[pkg][years];
  const tax = price * 0.1;
  return { price, tax, total: price + tax };
}
