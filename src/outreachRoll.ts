import { addDaysLocal, nextOrSameBusinessDayLocal } from './date';
import type { Prospect } from './types';

/** Advance missed Tasks rows so `next_show_date` is never before calendar today; mark overdue after a roll. */
export function rollIncompleteActiveOutreach(
  prospects: Prospect[],
  calendarToday: string,
): Prospect[] {
  let changed = false;
  const next = prospects.map((p) => {
    if (p.status !== 'active') return p;
    if (p.next_show_date >= calendarToday) return p;

    let d = p.next_show_date;
    while (d < calendarToday) {
      d = addDaysLocal(d, 1);
    }
    d = nextOrSameBusinessDayLocal(d);
    changed = true;
    return { ...p, next_show_date: d, outreach_overdue: true };
  });
  return changed ? next : prospects;
}
