import type { Prospect } from './types';

export const STORAGE_KEY = 'prospecting-daily-prospects-v1';

export function loadProspects(): Prospect[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Prospect[];
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
