import type { Prospect, WaitDays } from '../types';
import { ProspectRow } from './ProspectRow';

type Props = {
  prospects: Prospect[];
  onAddClick: () => void;
  onToggleStar: (id: string) => void;
  onLogTouch: (id: string, days: WaitDays) => void;
  onBookMeeting: (id: string) => void;
};

export function DailyList({
  prospects,
  onAddClick,
  onToggleStar,
  onLogTouch,
  onBookMeeting,
}: Props) {
  return (
    <section className="daily-list">
      <header className="daily-list-header">
        <button type="button" className="btn btn-add" onClick={onAddClick}>
          <span className="add-icon" aria-hidden="true">
            +
          </span>
          Add prospect
        </button>
        <h1 className="daily-list-title">Today&rsquo;s prospects</h1>
        <span className="count" aria-label={`${prospects.length} due today`}>
          {prospects.length}
        </span>
      </header>
      {prospects.length === 0 ? (
        <p className="empty-state">No prospects due today. Add one to get started.</p>
      ) : (
        <ul className="rows">
          {prospects.map((p) => (
            <ProspectRow
              key={p.id}
              prospect={p}
              onToggleStar={onToggleStar}
              onLogTouch={onLogTouch}
              onBookMeeting={onBookMeeting}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
