# Price & Availability Watcher

Track prices for items you care about (via the eBay Browse API), get a price
history over time, and get an email when the price drops or an item goes
back in stock.

This is a daily-build personal project. See [`DEVLOG.md`](./DEVLOG.md) for a
running, plain-language log of what's been built and why.

## How it works

- **Backend** (`backend/`): Node.js + Express API, SQLite for storage,
  `node-cron` for scheduled price checks, Nodemailer for email alerts.
- **Frontend** (`frontend/`): React + Vite dashboard — search for items,
  add them to your watchlist, see current/lowest price.

```
price-watcher/
  backend/    Express API, scheduler, eBay client, SQLite DB
  frontend/   React dashboard (Vite)
```

## Setup

### 1. eBay API credentials

Create a free eBay developer account and application at
https://developer.ebay.com/my/keys, then copy the Client ID and Client
Secret into `backend/.env` (see `backend/.env.example`). No user login is
needed — the backend uses the client-credentials flow to fetch its own
token.

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in EBAY_CLIENT_ID / EBAY_CLIENT_SECRET, SMTP creds
npm install
npm run dev             # http://localhost:4000
```

The SQLite database file (`data.sqlite`) is created automatically on first
run — no separate DB server needed.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

The dev server proxies `/api/*` requests to the backend on port 4000 (see
`vite.config.js`).

## Email alerts

Alerts are sent via SMTP (works with Gmail using an App Password, or any
SMTP provider). If SMTP isn't configured, alerts are logged to the console
instead of failing — useful while developing.

## Current status (v1)

- [x] Search eBay and add items to a watchlist
- [x] Scheduled price checks (cron, default every 6 hours)
- [x] Price history stored per item
- [x] Email alert on price drop or target price reached
- [x] Sparkline charts for price history in the dashboard
- [ ] User accounts / multi-user support
- [ ] Deploy to a public URL
- [ ] Additional marketplaces beyond eBay

## Roadmap ideas

See `DEVLOG.md` for day-by-day progress and what's planned next.
