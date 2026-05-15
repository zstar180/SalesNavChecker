import { formatCalendarDateMedium, formatWeekdayShort } from '../date';

type Props = {
  viewDate: string;
  businessToday: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToday: () => void;
};

export function DayNavigator({
  viewDate,
  businessToday,
  onPrevDay,
  onNextDay,
  onGoToday,
}: Props) {
  const isViewingToday = viewDate === businessToday;

  return (
    <div className="day-nav">
      <button
        type="button"
        className="btn btn-ghost day-nav-btn"
        onClick={onPrevDay}
        aria-label="Previous weekday"
      >
        <span aria-hidden="true">←</span>
        <span className="day-nav-btn-text">Previous</span>
      </button>
      <div className="day-nav-center">
        <div className="day-nav-dateline" aria-label={`${formatWeekdayShort(viewDate)}, ${formatCalendarDateMedium(viewDate)}`}>
          <span className="day-nav-day">{formatWeekdayShort(viewDate)}</span>
          <span className="day-nav-date">{formatCalendarDateMedium(viewDate)}</span>
        </div>
        {!isViewingToday ? (
          <button type="button" className="btn btn-ghost day-nav-today" onClick={onGoToday}>
            Jump to today
          </button>
        ) : (
          <span className="day-nav-today-hint">Viewing today</span>
        )}
      </div>
      <button
        type="button"
        className="btn btn-ghost day-nav-btn"
        onClick={onNextDay}
        aria-label="Next weekday"
      >
        <span className="day-nav-btn-text">Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
