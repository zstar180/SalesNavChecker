import { useMemo, useState } from 'react';
import { AddProspectOverlay } from './components/AddProspectOverlay';
import { DailyList } from './components/DailyList';
import { addDaysLocal, todayLocal } from './date';
import { loadProspects, saveProspects } from './storage';
import type { AddDayOption, Prospect, WaitDays } from './types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function App() {
  const [prospects, setProspects] = useState<Prospect[]>(() => loadProspects());
  const [overlayOpen, setOverlayOpen] = useState(false);

  const today = todayLocal();

  const eligible = useMemo(() => {
    const list = prospects.filter(
      (p) => p.status === 'active' && p.next_show_date <= today,
    );
    list.sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      if (a.created_at !== b.created_at) return a.created_at < b.created_at ? -1 : 1;
      if (a.name !== b.name) return a.name < b.name ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
    return list;
  }, [prospects, today]);

  function setAndPersist(updater: (prev: Prospect[]) => Prospect[]) {
    setProspects((prev) => {
      const next = updater(prev);
      saveProspects(next);
      return next;
    });
  }

  function addProspect({
    name,
    linkedin_url,
    days,
  }: {
    name: string;
    linkedin_url: string;
    days: AddDayOption;
  }) {
    const created_at = todayLocal();
    const next_show_date = addDaysLocal(created_at, days);
    const prospect: Prospect = {
      id: generateId(),
      name,
      linkedin_url,
      created_at,
      starred: false,
      next_show_date,
      status: 'active',
    };
    setAndPersist((prev) => [...prev, prospect]);
    setOverlayOpen(false);
  }

  function logTouch(id: string, days: WaitDays) {
    const next_show_date = addDaysLocal(todayLocal(), days);
    setAndPersist((prev) =>
      prev.map((p) => (p.id === id ? { ...p, next_show_date } : p)),
    );
  }

  function bookMeeting(id: string) {
    setAndPersist((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'meeting_booked' } : p)),
    );
  }

  function toggleStar(id: string) {
    setAndPersist((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)),
    );
  }

  return (
    <div className="app">
      <DailyList
        prospects={eligible}
        onAddClick={() => setOverlayOpen(true)}
        onToggleStar={toggleStar}
        onLogTouch={logTouch}
        onBookMeeting={bookMeeting}
      />
      <AddProspectOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onSave={addProspect}
      />
    </div>
  );
}
