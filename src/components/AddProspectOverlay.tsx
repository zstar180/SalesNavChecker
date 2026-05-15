import { useEffect, useMemo, useRef, useState } from 'react';
import { addBusinessDaysLocal, formatWeekdayName } from '../date';
import type { AddDayOption } from '../types';
import { ADD_DAY_OPTIONS } from '../types';

type Props = {
  open: boolean;
  businessToday: string;
  onClose: () => void;
  onSave: (input: { name: string; linkedin_url: string; days: AddDayOption }) => void;
};

const LINKEDIN_PATTERN = /linkedin\.com\//i;

function followUpOptionLabel(days: AddDayOption, businessToday: string): string {
  const weekday = formatWeekdayName(addBusinessDaysLocal(businessToday, days));
  const dayWord = days === 1 ? 'day' : 'days';
  return `${days} ${dayWord} - ${weekday}`;
}

export function AddProspectOverlay({ open, businessToday, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [days, setDays] = useState<AddDayOption>(0);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const followUpOptions = useMemo(
    () =>
      ADD_DAY_OPTIONS.map((d) => ({
        value: d,
        label: followUpOptionLabel(d, businessToday),
      })),
    [businessToday],
  );

  useEffect(() => {
    if (open) {
      setName('');
      setLinkedinUrl('');
      setDays(0);
      setErrors({});
      setTimeout(() => nameRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = linkedinUrl.trim();
    const nextErrors: { name?: string; url?: string } = {};
    if (!trimmedName) nextErrors.name = 'Name is required.';
    if (!trimmedUrl) nextErrors.url = 'LinkedIn URL is required.';
    else if (!LINKEDIN_PATTERN.test(trimmedUrl))
      nextErrors.url = 'URL must include linkedin.com/.';
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.url) return;
    onSave({ name: trimmedName, linkedin_url: trimmedUrl, days });
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
        aria-labelledby="overlay-title"
      >
        <div className="overlay-head">
          <h2 id="overlay-title">New prospect</h2>
          <button
            type="button"
            className="overlay-close"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form className="overlay-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field-label">Name</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              autoComplete="off"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label className="field">
            <span className="field-label">LinkedIn URL</span>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/username"
              aria-invalid={!!errors.url}
              autoComplete="off"
            />
            {errors.url && <span className="field-error">{errors.url}</span>}
          </label>
          <label className="field">
            <span className="field-label">Days until Follow up</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value) as AddDayOption)}
            >
              {followUpOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="field-help">
              Business days only — weekends are skipped (e.g. Thu + 2 → Mon).
            </span>
          </label>
          <div className="overlay-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
