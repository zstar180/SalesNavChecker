import { formatBumpSchedule } from '../date';
import type { Prospect } from '../types';
import { ProspectRow } from './ProspectRow';

type Props = {
  prospects: Prospect[];
  businessToday: string;
  onToggleStar: (id: string) => void;
  onOpenDone: (prospect: Prospect) => void;
  onBookMeeting: (id: string) => void;
  onRescheduleToDay: (id: string, targetDate: string) => void;
  onGoToBumpDay: (isoDate: string) => void;
};

export function FavoritesList({
  prospects,
  businessToday,
  onToggleStar,
  onOpenDone,
  onBookMeeting,
  onRescheduleToDay,
  onGoToBumpDay,
}: Props) {
  const countLabel = `${prospects.length} favorite${prospects.length === 1 ? '' : 's'}`;

  return (
    <section className="daily-list" id="panel-favorites" role="tabpanel" aria-labelledby="tab-favorites">
      <header className="daily-list-header daily-list-header-favorites">
        <h1 className="daily-list-title">Favorites</h1>
        <span className="count" aria-label={countLabel}>
          {prospects.length}
        </span>
      </header>
      {prospects.length === 0 ? (
        <p className="empty-state">
          No favorited contacts yet. Star someone on the Tasks list to see them here with their next
          bump date.
        </p>
      ) : (
        <ul className="rows">
          {prospects.map((p) => (
            <ProspectRow
              key={p.id}
              prospect={p}
              businessToday={businessToday}
              bumpScheduleLabel={formatBumpSchedule(p.next_show_date, businessToday)}
              onBumpDayClick={() => onGoToBumpDay(p.next_show_date)}
              onToggleStar={onToggleStar}
              onOpenDone={onOpenDone}
              onBookMeeting={onBookMeeting}
              onRescheduleToDay={onRescheduleToDay}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
