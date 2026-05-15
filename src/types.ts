export const ADD_DAY_OPTIONS = [0, 1, 2, 3, 5, 7, 9, 10] as const;
export type AddDayOption = (typeof ADD_DAY_OPTIONS)[number];

export type ProspectStatus = 'active' | 'meeting_booked' | 'outreach_stopped';

export type Prospect = {
  id: string;
  name: string;
  linkedin_url: string;
  created_at: string;
  starred: boolean;
  /** Calendar day this Tasks row is scheduled for (exact match in the list). */
  next_show_date: string;
  status: ProspectStatus;
  /** Workdays after each completed touch until the next Tasks date (set from add form). */
  outreach_interval_days?: AddDayOption;
  /** Rolled forward after a missed workday; cleared on Done or when rescheduled. */
  outreach_overdue?: boolean;
};
