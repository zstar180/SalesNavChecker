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
