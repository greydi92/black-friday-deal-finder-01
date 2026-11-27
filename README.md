# DealSleuth — Real Black Friday 2026 Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/greydi92/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/greydi92/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Bounty: [Build the best real Black Friday deal finder — make.fun/bounty/black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01)

Referral code: qgn48q27

## What it is

DealSleuth is a static deal-finder site for Black Friday 2026 shoppers. It lists **52 real deals across 6 stores** (Amazon, Best Buy, Walmart, Target, Dell, Samsung) in 8 categories — Audio, Wearables, Laptops, TVs, Gaming, Home, Kitchen, Tablets & Phones.

Every deal shows its product, store, sale price, usual price, discount, a link to the product at the store, and when the price was checked. Every deal also carries an honest verdict:

- **NEW LOW** — the sources report the lowest price ever for that product (11 deals)
- **STRONG DEAL** — a genuine large cut (38 deals)
- **ROUTINE SALE** — a real but modest cut (3 deals)

## How the deals were checked

Each price was read on **Friday 27 November 2026 (15:35 WIB)** from a deals source that names the store and the price — MacRumors, CNN Underscored, The Gadgeteer, Digital Citizen, DealNews, AppleInsider, and others — or from the store's own product page. Each deal card names its source, and the detail page quotes the evidence behind its verdict. Store links go to the store's own product page for the exact product wherever one was verified (23 direct links); the rest go to the store's search page for that product. Nothing is invented: no product, store, price or link appears here that no source showed when it was checked.

## Features

- A Top Picks strip: the 5 best deals by score, at the top of the unfiltered list
- Live search across titles, stores and categories
- Filters by category, store, and minimum discount (25% / 40% / 50%+)
- Sorting: best deals first (score = discount + verdict bonus + cash saved), biggest % off, biggest $ saved, lowest price
- A detail page per deal with the full price story, the evidence behind its verdict, and a same-product price comparison across stores (14 products compared)
- Category monograms on every deal card (two-letter text badges, one tint per category)
- A stats bar: deal count, new-low count, and total combined savings
- Phone layout (single column, full-width controls) and desktop grid
- Fully static: plain HTML/CSS/JS, no framework, no network requests — the deals live in `app/deals.js`

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — page shell, header, footer with the checking methodology
- `app/app.js` — boot, hash routing (`#/` list, `#/deal/<id>` detail), filter wiring
- `app/deals.js` — all 52 checked deals, categories, stores
- `app/filters.js` — deal score, filtering, sorting, price formatting
- `app/views.js` — deal cards, list and detail HTML
- `app/style.css` — the whole look, system fonts only
- `screenshots/` — 4 real renders of the site in headless Chrome
