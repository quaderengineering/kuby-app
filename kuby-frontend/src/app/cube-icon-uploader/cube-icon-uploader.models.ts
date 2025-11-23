export interface CubeConfigModel {
  displayId: number;
  mode: DisplayMode;
  time?: Date;
  iconByteArray?: string;
  iconForPreview?: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum DisplayMode {
  STOPWATCH = 1,
  TIMER,
}
