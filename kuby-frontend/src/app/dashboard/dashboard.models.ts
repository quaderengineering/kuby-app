import { FormControl } from '@angular/forms';
import { ActivityModel } from '../services/api-service';

export interface RtcTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface McuInterval {
  start: RtcTime;
  end: RtcTime | null;
}

export interface McuTimeModel {
  displayId: number;
  label: string;
  intervals: McuInterval[];
}

export interface TimeEntryEditForm {
  start: FormControl<Date | undefined | null>;
  end: FormControl<Date | undefined | null>;
  timeZoneInfo: FormControl<string | undefined | null>;
}

export interface TimeEntryModelFE {
  timeEntryId?: number;
  start?: Date;
  end?: Date;
  timeZoneInfo?: string;
}

export interface ActivityModelFE extends ActivityModel {
  timeEntriesFE?: TimeEntryModelFE[] | undefined;
}

// day-view.component.ts
export interface DayViewModel {
  date: Date;
  activities: ActivityDayDetail[];
  totalDuration: string;
}

export interface ActivityDayDetail {
  activityId: string;
  activityName: string;
  color: string;
  timeEntries: TimeEntryDetail[];
  totalDuration: string;
}

export interface TimeEntryDetail {
  timeEntryId: string;
  start: Date;
  end: Date;
  duration: string;
}

// week-view.component.ts
export interface WeekViewModel {
  weekStart: Date;
  weekEnd: Date;
  days: DaySummary[];
  activityTotals: ActivityTotal[];
  totalDuration: string;
}

export interface DaySummary {
  date: Date;
  totalHours: number;
  activities: { activityId: string; name: string; color: string; hours: number }[];
}

export interface ActivityTotal {
  activityId: string;
  name: string;
  color: string;
  totalHours: number;
  percentage: number;
}

// month-view.component.ts
export interface MonthViewModel {
  month: Date;
  days: MonthDay[];
  activityTotals: ActivityTotal[];
  totalDuration: string;
}

export interface MonthDay {
  date: Date | null; // null for padding days
  totalHours: number;
  activities: { activityId: string; name: string; color: string; hours: number }[];
}
