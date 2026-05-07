import { useEffect, useRef, useState } from 'react';
import type { AddDayOption } from '../types';
import { ADD_DAY_OPTIONS } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (input: { name: string; linkedin_url: string; days: AddDayOption }) => void;
};

const LINKEDIN_PATTERN = /linkedin\.com\//i;

export function AddProspectOverlay({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [days, setDays] = useState<AddDayOption>(0);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setLinkedinUrl('');
      setDays(0);
      setErrors({});
      // Focus the first field once the overlay opens.
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
            <span className="field-label">Days until next outreach</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value) as AddDayOption)}
            >
              {ADD_DAY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? 'day' : 'days'}
                </option>
              ))}
            </select>
            <span className="field-help">0 = show today</span>
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
