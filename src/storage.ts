import type { Prospect } from './types';

export const STORAGE_KEY = 'prospecting-daily-prospects-v1';

const GOOGLE_USER_KEY_PREFIX = `${STORAGE_KEY}:user:`;
const STALE_SESSION_KEY = 'prospecting-daily-user-v1';
const STALE_VIEW_DATE_KEY = 'prospecting-daily-view-date-v1';

function parseProspects(raw: string | null): Prospect[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Prospect[];
  } catch {
    return [];
  }
}

/** Pull data from an old Google-scoped key into the main key (one browser, first non-empty bucket). */
function migrateFromGoogleScopedKeysIfNeeded(): void {
  try {
    const existing = parseProspects(localStorage.getItem(STORAGE_KEY));
    if (existing.length > 0) return;

    const userKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(GOOGLE_USER_KEY_PREFIX)) userKeys.push(k);
    }
    userKeys.sort();

    for (const key of userKeys) {
      const list = parseProspects(localStorage.getItem(key));
      if (list.length === 0) continue;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      localStorage.removeItem(key);
      break;
    }
  } catch {
    // Ignore migration failures.
  }
}

/** Dev-seeded rows from an older build; safe to drop on load. */
function isLegacyDummyProspect(p: Prospect): boolean {
  return (
    p.id.startsWith('dummy-') ||
    /linkedin\.com\/in\/[^/]+-demo\/?$/i.test(p.linkedin_url)
  );
}

function stripLegacyDummyProspects(prospects: Prospect[]): Prospect[] {
  return prospects.filter((p) => !isLegacyDummyProspect(p));
}

export function loadProspects(): Prospect[] {
  try {
    migrateFromGoogleScopedKeysIfNeeded();
    try {
      localStorage.removeItem(STALE_SESSION_KEY);
      localStorage.removeItem(STALE_VIEW_DATE_KEY);
    } catch {
      // ignore
    }
    const loaded = parseProspects(localStorage.getItem(STORAGE_KEY));
    const cleaned = stripLegacyDummyProspects(loaded);
    if (cleaned.length !== loaded.length) {
      saveProspects(cleaned);
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function saveProspects(prospects: Prospect[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
  } catch {
    // Ignore quota / serialization errors for MVP.
  }
}
