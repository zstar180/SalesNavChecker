import { useEffect, useState } from 'react';
import { formatWeekdayShort, nextOrSameBusinessDayLocal, todayLocal } from '../date';
import type { Prospect } from '../types';

type Props = {
  open: boolean;
  prospect: Prospect | null;
  defaultNextDate: string;
  onClose: () => void;
  onSchedule: (nextShowDate: string) => void;
  onStopOutreach: () => void;
};

export function DoneOutreachOverlay({
  open,
  prospect,
  defaultNextDate,
  onClose,
  onSchedule,
  onStopOutreach,
}: Props) {
  const [picked, setPicked] = useState(defaultNextDate);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setPicked(defaultNextDate);
      setError(undefined);
    }
  }, [open, defaultNextDate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !prospect) return null;

  const minSchedule = nextOrSameBusinessDayLocal(todayLocal());

  function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) {
      setError('Pick a date.');
      return;
    }
    if (picked < minSchedule) {
      setError('Choose today or a future workday.');
      return;
    }
    setError(undefined);
    onSchedule(nextOrSameBusinessDayLocal(picked));
  }

  return (
    <div
      className="overlay-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="overlay-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="done-overlay-title"
      >
        <div className="overlay-head">
          <h2 id="done-overlay-title">Next Tasks</h2>
          <button
            type="button"
            className="overlay-close"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form className="overlay-form" onSubmit={handleSchedule} noValidate>
          <p className="overlay-lead">
            <strong>{prospect.name}</strong> — schedule the next touch, or stop tracking tasks.
          </p>
          <label className="field">
            <span className="field-label">Next Tasks date</span>
            <input
              type="date"
              value={picked}
              min={minSchedule}
              onChange={(e) => setPicked(e.target.value)}
              aria-invalid={!!error}
            />
            <span className="field-help">
              Default uses your cadence (
              {prospect.outreach_interval_days ?? 2}{' '}
              workday
              {(prospect.outreach_interval_days ?? 2) === 1 ? '' : 's'}
              ). Weekends snap to Monday.
            </span>
            {picked && (
              <span className="field-help">
                Scheduled: {formatWeekdayShort(nextOrSameBusinessDayLocal(picked))}
              </span>
            )}
            {error && <span className="field-error">{error}</span>}
          </label>
          <div className="overlay-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-ghost stop-tasks-btn" onClick={onStopOutreach}>
              Stop Tasks
            </button>
            <button type="submit" className="btn btn-primary">
              Save date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
