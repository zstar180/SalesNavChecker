import { useState } from 'react';
import type { Prospect, WaitDays } from '../types';
import { WAIT_OPTIONS } from '../types';

type Props = {
  prospect: Prospect;
  onToggleStar: (id: string) => void;
  onLogTouch: (id: string, days: WaitDays) => void;
  onBookMeeting: (id: string) => void;
};

export function ProspectRow({ prospect, onToggleStar, onLogTouch, onBookMeeting }: Props) {
  const [waitDays, setWaitDays] = useState<WaitDays>(2);

  return (
    <li className="row">
      <div className="row-left">
        <button
          type="button"
          className={`star ${prospect.starred ? 'star-on' : 'star-off'}`}
          aria-label={prospect.starred ? 'Unstar' : 'Star'}
          aria-pressed={prospect.starred}
          onClick={() => onToggleStar(prospect.id)}
        >
          {prospect.starred ? '\u2605' : '\u2606'}
        </button>
        <div className="row-name-wrap">
          <span className="row-name">{prospect.name}</span>
          <a
            className="row-link"
            href={prospect.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="row-right">
        <label className="visually-hidden" htmlFor={`wait-${prospect.id}`}>
          Days to wait
        </label>
        <select
          id={`wait-${prospect.id}`}
          className="wait-select"
          value={waitDays}
          onChange={(e) => setWaitDays(Number(e.target.value) as WaitDays)}
        >
          {WAIT_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d} {d === 1 ? 'day' : 'days'}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onLogTouch(prospect.id, waitDays)}
        >
          Log touch &amp; wait
        </button>
        <button
          type="button"
          className="btn btn-accent"
          onClick={() => onBookMeeting(prospect.id)}
        >
          Meeting booked!
        </button>
      </div>
    </li>
  );
}
