import { useEffect, useMemo, useState } from 'react';
import { AddProspectOverlay } from './components/AddProspectOverlay';
import { AppTabs, type AppTab } from './components/AppTabs';
import { DailyList } from './components/DailyList';
import { DayNavigator } from './components/DayNavigator';
import { DoneOutreachOverlay } from './components/DoneOutreachOverlay';
import { FavoritesList } from './components/FavoritesList';
import {
  addBusinessDaysLocal,
  nextBusinessDayLocal,
  nextOrSameBusinessDayLocal,
  previousBusinessDayLocal,
  todayLocal,
} from './date';
import { rollIncompleteActiveOutreach } from './outreachRoll';
import { loadProspects, saveProspects } from './storage';
import type { AddDayOption, Prospect } from './types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function App() {
  const [prospects, setProspects] = useState<Prospect[]>(() => loadProspects());
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [doneProspect, setDoneProspect] = useState<Prospect | null>(null);
  const [viewDate, setViewDate] = useState(() => nextOrSameBusinessDayLocal(todayLocal()));
  const [activeTab, setActiveTab] = useState<AppTab>('tasks');

  const calendarToday = todayLocal();
  const businessToday = nextOrSameBusinessDayLocal(calendarToday);

  const doneDefaultNextDate = useMemo(() => {
    if (!doneProspect) return businessToday;
    return addBusinessDaysLocal(
      businessToday,
      doneProspect.outreach_interval_days ?? 2,
    );
  }, [doneProspect, businessToday]);

  useEffect(() => {
    const today = todayLocal();
    setProspects((prev) => {
      const rolled = rollIncompleteActiveOutreach(prev, today);
      if (rolled === prev) return prev;
      saveProspects(rolled);
      return rolled;
    });
  }, []);

  const eligible = useMemo(() => {
    const list = prospects.filter(
      (p) => p.status === 'active' && p.next_show_date === viewDate,
    );
    list.sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      if (a.created_at !== b.created_at) return a.created_at < b.created_at ? -1 : 1;
      if (a.name !== b.name) return a.name < b.name ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
    return list;
  }, [prospects, viewDate]);

  const favorites = useMemo(() => {
    const list = prospects.filter((p) => p.starred && p.status === 'active');
    list.sort((a, b) => {
      if (a.next_show_date !== b.next_show_date) {
        return a.next_show_date < b.next_show_date ? -1 : 1;
      }
      if (a.name !== b.name) return a.name < b.name ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
    return list;
  }, [prospects]);

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
    const next_show_date = addBusinessDaysLocal(created_at, days);
    const prospect: Prospect = {
      id: generateId(),
      name,
      linkedin_url,
      created_at,
      starred: false,
      next_show_date,
      status: 'active',
      outreach_interval_days: days,
      outreach_overdue: false,
    };
    setAndPersist((prev) => [...prev, prospect]);
    setOverlayOpen(false);
  }

  function scheduleNextOutreach(nextShowDate: string) {
    if (!doneProspect) return;
    const id = doneProspect.id;
    const snapped = nextOrSameBusinessDayLocal(nextShowDate);
    setAndPersist((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, next_show_date: snapped, outreach_overdue: false } : p,
      ),
    );
    setDoneProspect(null);
  }

  function stopOutreachFromDone() {
    if (!doneProspect) return;
    const id = doneProspect.id;
    setAndPersist((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'outreach_stopped', outreach_overdue: false }
          : p,
      ),
    );
    setDoneProspect(null);
  }

  function bookMeeting(id: string) {
    setAndPersist((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'meeting_booked', outreach_overdue: false } : p,
      ),
    );
  }

  function toggleStar(id: string) {
    setAndPersist((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)),
    );
  }

  function rescheduleToDay(id: string, targetDate: string) {
    const snapped = nextOrSameBusinessDayLocal(targetDate);
    setAndPersist((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, next_show_date: snapped, outreach_overdue: false } : p,
      ),
    );
  }

  function goToBumpDay(isoDate: string) {
    setViewDate(nextOrSameBusinessDayLocal(isoDate));
    setActiveTab('tasks');
  }

  return (
    <div className="app">
      <AppTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === 'tasks' ? (
        <>
          <DayNavigator
            viewDate={viewDate}
            businessToday={businessToday}
            onPrevDay={() => setViewDate((d) => previousBusinessDayLocal(d))}
            onNextDay={() => setViewDate((d) => nextBusinessDayLocal(d))}
            onGoToday={() => setViewDate(businessToday)}
          />
          <DailyList
            prospects={eligible}
            businessToday={businessToday}
            onAddClick={() => setOverlayOpen(true)}
            onToggleStar={toggleStar}
            onOpenDone={(p) => setDoneProspect(p)}
            onBookMeeting={bookMeeting}
            onRescheduleToDay={rescheduleToDay}
          />
        </>
      ) : (
        <FavoritesList
          prospects={favorites}
          businessToday={businessToday}
          onToggleStar={toggleStar}
          onOpenDone={(p) => setDoneProspect(p)}
          onBookMeeting={bookMeeting}
          onRescheduleToDay={rescheduleToDay}
          onGoToBumpDay={goToBumpDay}
        />
      )}
      <AddProspectOverlay
        open={overlayOpen}
        businessToday={businessToday}
        onClose={() => setOverlayOpen(false)}
        onSave={addProspect}
      />
      <DoneOutreachOverlay
        open={!!doneProspect}
        prospect={doneProspect}
        defaultNextDate={doneDefaultNextDate}
        onClose={() => setDoneProspect(null)}
        onSchedule={scheduleNextOutreach}
        onStopOutreach={stopOutreachFromDone}
      />
    </div>
  );
}
