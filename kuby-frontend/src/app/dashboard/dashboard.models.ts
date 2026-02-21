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
