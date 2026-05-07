# Prospecting Daily List (MVP)

A minimal personal outreach task app: a daily list of prospects to interact with. Each row is a prospect with a name and a plain LinkedIn link (opens in a new tab). For each prospect you can either log a touch and wait N days, or mark a meeting booked (which permanently removes them from the daily list in this MVP).

No LinkedIn / Sales Navigator APIs. No backend. No accounts. Data lives entirely in your browser.

## Stack

- React + TypeScript + Vite
- Plain CSS (no Tailwind, no state library)

## Install & run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build locally
```

## Where data lives

All prospect data is stored in your browser's `localStorage` under the key:

```
prospecting-daily-prospects-v1
```

Clearing your browser site data for the dev origin will reset the app. There are no servers and no external API calls.

## Behavior

- Daily list shows prospects where `status === "active"` and `next_show_date <= today` (local calendar).
- Sorted: starred first, then oldest `created_at` first, then name, then id.
- Add prospect overlay creates a row with `created_at = today`, `next_show_date = today + days_until_next_outreach`, `starred = false`, `status = "active"`.
- "Log touch & wait" with N in {1, 2, 3, 5, 7, 9, 10} sets `next_show_date = today + N`.
- "Meeting booked!" sets `status = "meeting_booked"` so the row never appears on the daily list again (the record stays in storage for a future archived view).
- Star toggles immediately and persists.
- LinkedIn URL must contain `linkedin.com/`. Name is required.
