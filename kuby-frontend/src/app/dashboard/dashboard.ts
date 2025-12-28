import { Component, inject, OnInit, signal } from '@angular/core';
import { McuTimeModel, RtcTime } from './dashboard.models';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { CubeClient, IntervalModel, TimeModel } from '../services/api-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, Ripple],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public timeModels$?: Observable<TimeModel[]>;

  private readonly cubeService = inject(CubeClient);
  private readonly http = inject(HttpClient);

  public ngOnInit() {
    this.timeModels$ = this.http
      .get<McuTimeModel[]>('/timemock.json')
      .pipe(map((raw) => raw.map((mcu) => this.mapFromMcu(mcu))));

    this.timeModels$.pipe(switchMap((times) => this.cubeService.times(times))).subscribe();
  }

  private mapFromMcu(mcu: McuTimeModel): TimeModel {
    const intervals = mcu.intervals.map((i) => ({
      start: this.rtcToDate(i.start),
      end: i.end ? this.rtcToDate(i.end) : null,
    }));

    return {
      displayId: mcu.displayId,
      label: mcu.label,
      intervals: intervals.map((i) => ({ end: i.end, start: i.start } as IntervalModel)),
      timeZoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private rtcToDate(rtc: RtcTime): Date {
    return new Date(Date.UTC(rtc.year, rtc.month - 1, rtc.day, rtc.hour, rtc.minute, rtc.second));
  }
}
