// Filtering, scoring and sorting for the deal finder. One job: turn the
// raw deal list into the ordered list the page shows.

import { deals } from "./deals.js";

export const SIGNAL_LABEL = {
  "new-low": "NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE SALE",
};

export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function savedAmount(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

// Deal score: discount percentage, plus a bonus for a verified new low or a
// strong cut, plus a small bonus for large cash savings. Best deals first.
export function dealScore(d) {
  const bonus = d.signal === "new-low" ? 20 : d.signal === "strong" ? 8 : 0;
  return percentOff(d) + bonus + Math.min(15, savedAmount(d) / 50);
}

export function formatPrice(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function formatChecked(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }) + " WIB"
  );
}

export function filterDeals({ query = "", category = "", store = "", minOff = 0 }) {
  const q = query.trim().toLowerCase();
  return deals.filter((d) => {
    if (category && d.category !== category) return false;
    if (store && d.store !== store) return false;
    if (percentOff(d) < minOff) return false;
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function sortDeals(list, sort) {
  const out = [...list];
  if (sort === "biggest-pct") out.sort((a, b) => percentOff(b) - percentOff(a));
  else if (sort === "lowest-price") out.sort((a, b) => a.price - b.price);
  else if (sort === "biggest-saving") out.sort((a, b) => savedAmount(b) - savedAmount(a));
  else out.sort((a, b) => dealScore(b) - dealScore(a));
  return out;
}

export function totals(list) {
  const saved = list.reduce((s, d) => s + savedAmount(d), 0);
  const newLows = list.filter((d) => d.signal === "new-low").length;
  return { count: list.length, saved: Math.round(saved), newLows };
}
