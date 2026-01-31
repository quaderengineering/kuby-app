import { TimeModel } from '../services/api-service';

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

export interface IntervalModelFE {
  intervalId?: number;
  start?: Date;
  end?: Date;
}

export interface TimeModelFE extends TimeModel {
  intervalsFE?: IntervalModelFE[] | undefined;
}
