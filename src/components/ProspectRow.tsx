import { useMemo } from 'react';
import { addBusinessDaysLocal, formatWeekdayShort } from '../date';
import type { Prospect } from '../types';

const MOVE_BUSINESS_DAY_RANGE = 60;

type Props = {
  prospect: Prospect;
  businessToday: string;
  bumpScheduleLabel?: string;
  onBumpDayClick?: () => void;
  onToggleStar: (id: string) => void;
  onOpenDone: (prospect: Prospect) => void;
  onBookMeeting: (id: string) => void;
  onRescheduleToDay: (id: string, targetDate: string) => void;
};

export function ProspectRow({
  prospect,
  businessToday,
  bumpScheduleLabel,
  onBumpDayClick,
  onToggleStar,
  onOpenDone,
  onBookMeeting,
  onRescheduleToDay,
}: Props) {
  const moveOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let n = 0; n <= MOVE_BUSINESS_DAY_RANGE; n += 1) {
      const value = addBusinessDaysLocal(businessToday, n);
      if (value === prospect.next_show_date) continue;
      opts.push({
        value,
        label: `${n}d · ${formatWeekdayShort(value)}`,
      });
    }
    return opts;
  }, [businessToday, prospect.next_show_date]);

  return (
    <li className={`row ${prospect.outreach_overdue ? 'row-overdue' : ''}`}>
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
          {bumpScheduleLabel ? (
            onBumpDayClick ? (
              <button
                type="button"
                className="row-bump row-bump-btn"
                onClick={onBumpDayClick}
              >
                Bump: {bumpScheduleLabel}
              </button>
            ) : (
              <span className="row-bump">Bump: {bumpScheduleLabel}</span>
            )
          ) : null}
        </div>
      </div>
      <div className="row-right">
        <button
          type="button"
          className="btn btn-primary btn-row-action"
          aria-label="Done — set next Tasks date or stop Tasks"
          onClick={() => onOpenDone(prospect)}
        >
          Done
        </button>
        <div className="row-move-wrap">
          <label className="visually-hidden" htmlFor={`move-${prospect.id}`}>
            Move Tasks offset (business workdays from anchor)
          </label>
          <select
            key={`${prospect.id}-${prospect.next_show_date}`}
            id={`move-${prospect.id}`}
            className="wait-select move-day-select row-move-select"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              onRescheduleToDay(prospect.id, v);
            }}
          >
            <option value="">Move</option>
            {moveOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn-end btn-row-action"
          aria-label="End — mark meeting booked; removes from Tasks list"
          onClick={() => onBookMeeting(prospect.id)}
        >
          End
        </button>
      </div>
    </li>
  );
}
