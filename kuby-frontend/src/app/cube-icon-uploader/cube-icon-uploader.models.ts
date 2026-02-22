export interface CubeConfigModel {
  activityId: string | null;
  label: string | null;
  displayId: number;
  mode: DisplayMode;
  time?: Date;
  iconByteArray?: string;
  iconForPreview?: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum DisplayMode {
  STOPWATCH = 1,
  TIMER,
}
