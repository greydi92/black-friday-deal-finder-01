// HTML for every page of the finder, built from the deal data. Every value
// from the data is escaped before it goes into the page.

import { formatChecked, formatPrice, percentOff, savedAmount, SIGNAL_LABEL, sortDeals } from "./filters.js";
import { CHECKED_LABEL } from "./deals.js";

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Two-letter monogram per category, pure text, no images.
export const CATEGORY_MONO = {
  "Audio": "AU",
  "Wearables": "WE",
  "Laptops": "LA",
  "TVs": "TV",
  "Gaming": "GA",
  "Home": "HO",
  "Kitchen": "KI",
  "Tablets & Phones": "TA",
};

export function catSlug(c) {
  return c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
}

export function signalBadge(d) {
  return `<span class="badge badge-${d.signal}">${SIGNAL_LABEL[d.signal]}</span>`;
}

// The five best deals by score, as a curated strip at the top of the list.
export function topPicks(list) {
  const picks = sortDeals(list, "best").slice(0, 5);
  const cards = picks.map((d, i) => `<article class="pick">
  <span class="pick-rank" aria-hidden="true">#${i + 1}</span>
  <span class="mono mono-${catSlug(d.category)}" aria-hidden="true">${CATEGORY_MONO[d.category] || "DS"}</span>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price"><strong>${formatPrice(d.price)}</strong> <s>${formatPrice(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">${escape(d.store)} &middot; you save ${formatPrice(savedAmount(d))} ${signalBadge(d)}</p>
</article>`).join("");
  return `<section class="picks" aria-label="Top picks">
  <h2>Top picks &mdash; the 5 best deals right now</h2>
  <p class="picks-note">Ranked by discount, verdict and cash saved. Every price checked ${CHECKED_LABEL}.</p>
  <div class="picks-grid">${cards}</div>
</section>`;
}

export function dealCard(d) {
  return `<article class="card">
  <div class="card-top"><span class="mono mono-${catSlug(d.category)}" aria-hidden="true">${CATEGORY_MONO[d.category] || "DS"}</span><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price"><strong>${formatPrice(d.price)}</strong> <s>${formatPrice(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${formatPrice(savedAmount(d))} ${signalBadge(d)}</p>
  <p class="meta">Checked ${formatChecked(d.checked)} &middot; ${escape(d.source)}</p>
  <p class="actions"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a>
  <a class="details" href="#/deal/${encodeURIComponent(d.id)}">Why this is a deal</a></p>
</article>`;
}

export function dealRows(list) {
  if (list.length === 0) {
    return `<p class="empty">No deal matches those filters. Clear the search or lower the minimum discount.</p>`;
  }
  return `<div class="grid">${list.map(dealCard).join("")}</div>`;
}

export function compareTable(d) {
  if (!d.also || d.also.length === 0) return "";
  const rows = [{ store: d.store, price: d.price }, ...d.also]
    .sort((a, b) => a.price - b.price)
    .map(
      (r) =>
        `<tr><td>${escape(r.store)}</td><td>${formatPrice(r.price)}</td><td>${r.store === d.store ? "This listing" : "Same product, other store"}</td></tr>`,
    )
    .join("");
  return `<h2>Same product, other stores</h2>
<table class="compare"><thead><tr><th>Store</th><th>Price</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table>
<p class="fine">Other-store prices are the ones the sources listed on 27 Nov 2026; check the store page before you buy.</p>`;
}

export function dealPage(d) {
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="mono mono-${catSlug(d.category)}" aria-hidden="true">${CATEGORY_MONO[d.category] || "DS"}</span><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="price big"><strong>${formatPrice(d.price)}</strong> <s>${formatPrice(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${formatPrice(savedAmount(d))} ${signalBadge(d)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${formatPrice(d.price)}</dd>
    <dt>Usual price</dt><dd>${formatPrice(d.was)}</dd>
    <dt>Discount</dt><dd>${percentOff(d)}% off, ${formatPrice(savedAmount(d))} saved</dd>
    <dt>Checked</dt><dd>${formatChecked(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
    <dt>Is it really a deal?</dt><dd><strong>${SIGNAL_LABEL[d.signal]}</strong> &mdash; ${escape(d.evidence)}</dd>
    <dt>How to get it</dt><dd>${escape(d.note)}</dd>
  </dl>
  <p><a class="btn big" href="${escape(d.url)}" target="_blank" rel="noopener">Buy at ${escape(d.store)} &rarr;</a></p>
  ${compareTable(d)}
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
