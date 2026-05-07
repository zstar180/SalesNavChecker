export type WaitDays = 1 | 2 | 3 | 5 | 7 | 9 | 10;

export const WAIT_OPTIONS: WaitDays[] = [1, 2, 3, 5, 7, 9, 10];

export const ADD_DAY_OPTIONS = [0, 1, 2, 3, 5, 7, 9, 10] as const;
export type AddDayOption = (typeof ADD_DAY_OPTIONS)[number];

export type ProspectStatus = 'active' | 'meeting_booked';

export type Prospect = {
  id: string;
  name: string;
  linkedin_url: string;
  created_at: string;
  starred: boolean;
  next_show_date: string;
  status: ProspectStatus;
};
