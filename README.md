# Prospecting Tasks List (MVP)

A minimal personal task list for prospecting: each row is a prospect with a name and a plain LinkedIn link (opens in a new tab). You can complete a touch and schedule the next Tasks date, mark **End** when a meeting is booked (which removes them from the daily Tasks list in this MVP), or **Stop Tasks** to stop following up.

No LinkedIn / Sales Navigator APIs. No backend. No sign-in. Data lives in your browser’s `localStorage` for this site origin—**per browser profile** (for example, each Chrome profile has its own storage).

## Stack

- React + TypeScript + Vite
- Plain CSS (no Tailwind, no state library)

## Install & run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Prospects and your selected list date are **saved automatically** in `localStorage` whenever they change, so closing the tab or refreshing does not lose work on this browser profile.

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build locally
```

## Where data lives

Prospects are stored under:

```
prospecting-daily-prospects-v1
```

The list always **opens on today** (or the next weekday if today is a weekend). The date you browse with the arrows is not saved across refresh.

Websites cannot read Chrome’s “signed in to Chrome” identity. If you previously used a build that stored data under Google-scoped keys (`prospecting-daily-prospects-v1:user:…`), the app **moves the first non-empty bucket** into the main prospects key the first time it loads with an empty main list.

Clearing site data for this origin removes your list. Different devices or browser profiles do not share data unless you add sync later.

## Behavior

- Each active prospect has a **`next_show_date`**: the **only** calendar date they appear on the list (exact match for the date you are viewing).
- Use the controls at the top to move between **weekdays only** (Sat/Sun are skipped). On load and refresh the list shows **today** (next weekday on weekends).
- **Weekends:** Add-form offsets, **Done** defaults, and **Move** all use **business workdays** (Mon–Fri). Saturday/Sunday are skipped (e.g. Thu + 2 workdays → Mon). Scheduled dates on a weekend snap to the next Monday.
- If a task was still scheduled on a **past** calendar date when you open the app, it **rolls forward** to **today or the next workday** and is marked **overdue** (red) until you **Done** or **Move**.
- **Add prospect**: saves **`outreach_interval_days`** from the form; first **`next_show_date`** is **today + that many business workdays** (0 = next workday on or after today). Dropdown options show counts as **`N Tasks`**.
- **Done** opens a dialog: pick **next Tasks date** (default = **today + cadence workdays**) or **Stop Tasks** (`outreach_stopped` — hidden from the list like a meeting).
- **Move** lists **0–60 business workdays from today** as `Nd · weekday`, and moves the row to that date (removes it from the current view).
- **End** sets `status = "meeting_booked"` so the row no longer appears on the list (record stays in storage).
- Sorted: starred first, then oldest `created_at`, then name, then id.
- Star toggles immediately and persists.
- LinkedIn URL must contain `linkedin.com/`. Name is required.
