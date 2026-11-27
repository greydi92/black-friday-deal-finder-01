// DealSleuth boot: hash routing, live search and filters, sorting.
// Routes: #/ lists every deal, #/deal/<id> opens one deal. The list renders
// from the data in deals.js, so the page works with no network at all.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES, CHECKED_LABEL } from "./deals.js";
import { filterDeals, formatPrice, sortDeals, totals } from "./filters.js";
import { dealPage, dealRows, missingPage, topPicks } from "./views.js";

const app = document.getElementById("app");
const countLine = document.getElementById("count-line");

const state = { query: "", category: "", store: "", minOff: 0, sort: "best" };

function controlsHtml() {
  const catOptions = ['<option value="">All categories</option>'].concat(
    CATEGORIES.map((c) => `<option value="${c}">${c}</option>`),
  ).join("");
  const storeOptions = ['<option value="">All stores</option>'].concat(
    STORES.map((s) => `<option value="${s}">${s}</option>`),
  ).join("");
  return `<section class="controls" aria-label="Search and filter deals">
  <input id="q" type="search" placeholder="Search deals, stores, categories&hellip;" value="${state.query.replace(/"/g, "&quot;")}" aria-label="Search deals">
  <select id="cat" aria-label="Filter by category">${catOptions}</select>
  <select id="store" aria-label="Filter by store">${storeOptions}</select>
  <select id="minoff" aria-label="Minimum discount">
    <option value="0">Any discount</option>
    <option value="25">25% off or more</option>
    <option value="40">40% off or more</option>
    <option value="50">50% off or more</option>
  </select>
  <select id="sort" aria-label="Sort deals">
    <option value="best">Best deals first</option>
    <option value="biggest-pct">Biggest % off</option>
    <option value="biggest-saving">Biggest $ saved</option>
    <option value="lowest-price">Lowest price</option>
  </select>
</section>`;
}

function renderList() {
  const filtered = filterDeals(state);
  const shown = sortDeals(filtered, state.sort);
  const t = totals(deals);
  const shownTotals = totals(shown);
  countLine.innerHTML =
    `Showing ${shown.length} of ${t.count} deals &middot; ${t.newLows} new lows &middot; ${formatPrice(t.saved)} total savings if you bought them all &middot; all prices checked ${CHECKED_LABEL}`;
  const isDefault = !state.query && !state.category && !state.store && state.minOff === 0 && state.sort === "best";
  app.innerHTML = `<h1>Black Friday 2026: the deals worth your money</h1>
<p class="lede">${t.count} real deals across ${STORES.length} stores, each price checked today and marked with an honest verdict: new low, strong deal, or routine sale.</p>
${isDefault ? topPicks(deals) : ""}
${controlsHtml()}
<p class="subcount">Showing <strong>${shown.length}</strong> deals &middot; ${formatPrice(shownTotals.saved)} combined savings on this page</p>
${dealRows(shown)}`;
  const q = document.getElementById("q");
  q.value = state.query;
  document.getElementById("cat").value = state.category;
  document.getElementById("store").value = state.store;
  document.getElementById("minoff").value = String(state.minOff);
  document.getElementById("sort").value = state.sort;
  q.addEventListener("input", () => {
    state.query = q.value;
    renderList();
    const nq = document.getElementById("q");
    nq.focus();
    nq.setSelectionRange(nq.value.length, nq.value.length);
  });
  document.getElementById("cat").addEventListener("change", (e) => { state.category = e.target.value; renderList(); });
  document.getElementById("store").addEventListener("change", (e) => { state.store = e.target.value; renderList(); });
  document.getElementById("minoff").addEventListener("change", (e) => { state.minOff = Number(e.target.value); renderList(); });
  document.getElementById("sort").addEventListener("change", (e) => { state.sort = e.target.value; renderList(); });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealSleuth`;
    countLine.style.display = "none";
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    // Shareable filtered links: #/?q=sony&cat=Audio&store=Best+Buy&minoff=50&sort=biggest-pct
    const params = new URLSearchParams(location.hash.replace(/^#\/\??/, ""));
    if (params.has("q")) state.query = params.get("q");
    if (params.has("cat")) state.category = params.get("cat");
    if (params.has("store")) state.store = params.get("store");
    if (params.has("minoff")) state.minOff = Number(params.get("minoff")) || 0;
    if (params.has("sort")) state.sort = params.get("sort");
    countLine.style.display = "";
    document.title = "DealSleuth — Real Black Friday 2026 Deals, Checked Today";
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
