# Dev Log — Price & Availability Watcher

A day-by-day, plain-language log of building this project. No jargon
required to follow along — the goal is that anyone can read an entry and
understand what got built and why.

---

## Day 1 — 2026-09-09

**What this project is:** An app that watches prices for things you want to
buy, and emails you when the price drops or the item comes back in stock —
so you don't have to keep checking manually.

**What I built today:** The foundation — the "plumbing" that everything
else will sit on top of.

- **A backend server.** This is the part of the app that does the actual
  work behind the scenes: talking to eBay to look up prices, remembering
  what you're tracking, and checking for changes on a schedule.
- **A small database.** Every item you decide to track gets saved here,
  along with a running history of its price every time we check it. This
  is what lets us later show "here's how the price has changed over the
  last month."
- **A connection to eBay.** The app can search eBay for products and read
  their current price and stock status, using eBay's official developer
  API (no scraping — this is the sanctioned, stable way to get this data).
- **A scheduler.** Every few hours, the app automatically re-checks the
  price of everything you're tracking, without you having to do anything.
- **An email alert system.** When a tracked item's price drops — either
  below a target price you set, or just drops at all — the app sends an
  email. (Right now, if email isn't set up yet, it just prints the alert
  to the screen instead, so nothing breaks while I'm still setting things
  up.)
- **A basic web page (dashboard).** A simple screen where you can search
  for a product, click "Track" to start watching it, and see a table of
  everything you're currently tracking with its current and lowest-ever
  price.

**Why it's built this way:** I kept today's version deliberately simple —
one data source (eBay), one way to get notified (email), and no user
accounts yet. The idea is to get a real, working version end-to-end first
(search → track → check price → get notified), then improve it daily
rather than trying to build the "perfect" version all at once.

**What's next:**
- Add simple charts so price history is visual, not just a table of numbers
- Deploy it somewhere so it's not just running on my own machine
- Add more places to watch prices, beyond eBay

---

## Day 2 — 2026-09-10

**What I built today:** Made the price history actually visible, instead of
just numbers sitting in the database.

- **Trend charts on the dashboard.** Every item you're tracking now shows a
  small line chart (a "sparkline") right in the watchlist, so you can see at
  a glance whether the price has been going up, down, or staying flat —
  without having to read a table of numbers.
- **A dot marking the latest price**, so the most recent check is always
  clearly visible at the end of the line, and you can hover over any point
  on the line to see the exact price at that moment.
- **The backend now hands over price history efficiently** — instead of the
  dashboard having to ask "what's the history for item 1? item 2? item 3?"
  one at a time, it gets everything in a single request, so the page stays
  fast even as the watchlist grows.

**Why:** A table of raw prices is hard to read at a glance. A trend line
answers "is this worth buying now?" in about half a second, which is the
whole point of a price watcher.

**How I checked it worked:** Since I don't have real eBay API credentials
set up yet, I temporarily inserted a handful of fake price points straight
into the database, confirmed the dashboard's data endpoint returned them in
the right order, and confirmed the frontend still builds cleanly with the
new chart code. Then removed the fake data before committing.

**What's next:**
- Get real eBay credentials wired in so this runs against live data
- Deploy the app somewhere public
- Look into a second data source (see "other ways to get the data" below)

---

<!--
Template for future entries — copy this below the newest entry:

## Day N — YYYY-MM-DD

**What I built today:**
-

**Why:**
-

**What's next:**
-
-->
