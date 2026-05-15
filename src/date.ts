function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatLocal(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayLocal(): string {
  return formatLocal(new Date());
}

export function addDaysLocal(base: string, days: number): string {
  const [y, m, d] = base.split('-').map(Number);
  // Local-calendar arithmetic: handles DST and month rollovers correctly.
  const next = new Date(y, m - 1, d + days);
  return formatLocal(next);
}

const weekendDay = (iso: string): number => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

/** Saturday = 6, Sunday = 0 */
export function isWeekendLocal(iso: string): boolean {
  const day = weekendDay(iso);
  return day === 0 || day === 6;
}

/** Earliest weekday on or after `iso` (same day if already Mon–Fri). */
export function nextOrSameBusinessDayLocal(iso: string): string {
  let d = iso;
  while (isWeekendLocal(d)) {
    d = addDaysLocal(d, 1);
  }
  return d;
}

export function previousBusinessDayLocal(from: string): string {
  let d = addDaysLocal(from, -1);
  while (isWeekendLocal(d)) {
    d = addDaysLocal(d, -1);
  }
  return d;
}

/** Next weekday strictly after `from` (Fri → Mon). */
export function nextBusinessDayLocal(from: string): string {
  let d = addDaysLocal(from, 1);
  while (isWeekendLocal(d)) {
    d = addDaysLocal(d, 1);
  }
  return d;
}

/**
 * Add N **business** days (Mon–Fri) starting from `from`.
 * `0` means the next or same business day on/after `from` (never lands on Sat/Sun).
 * Each step skips weekends (Thu + 2 → Mon).
 */
export function addBusinessDaysLocal(from: string, businessDayCount: number): string {
  if (businessDayCount <= 0) {
    return nextOrSameBusinessDayLocal(from);
  }
  let d = from;
  for (let i = 0; i < businessDayCount; i += 1) {
    d = addDaysLocal(d, 1);
    d = nextOrSameBusinessDayLocal(d);
  }
  return d;
}

/** Abbreviated weekday only, e.g. Fri, Thu (locale-aware). */
export function formatWeekdayShort(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const raw = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(
    new Date(y, m - 1, d),
  );
  return raw.replace(/\.$/, '').trim();
}

/** Full weekday name, e.g. Friday, Monday (locale-aware). */
export function formatWeekdayName(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(y, m - 1, d));
}

/** Calendar date without weekday, e.g. Jan 16, 2026 */
export function formatCalendarDateMedium(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

/** Label for when an active contact is next due for a bump. */
export function formatBumpSchedule(isoDate: string, businessToday: string): string {
  if (isoDate === businessToday) return 'Today';
  return `${formatWeekdayName(isoDate)} · ${formatCalendarDateMedium(isoDate)}`;
}
