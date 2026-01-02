import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { McuTimeModel, RtcTime } from './dashboard.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  CubeClient,
  CubeTimeSearchModel,
  IntervalModel,
  TimeModel,
  TimeViewModel,
} from '../services/api-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePickerModule, DatePickerMonthChangeEvent } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, Ripple, DatePickerModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public timeModels$?: Observable<TimeViewModel[]>;

  public date = new BehaviorSubject<Date>(new Date());

  private searchCriteria = new BehaviorSubject<CubeTimeSearchModel>({
    dateFrom: this.getDefaultDateFrom(),
    dateTo: this.getDefaultDateTo(),
  });

  private readonly cubeService = inject(CubeClient);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.http
      .get<McuTimeModel[]>('/timemock.json')
      .pipe(
        map((raw) => raw.map((mcu) => this.mapFromMcu(mcu))),
        switchMap((times) =>
          this.cubeService
            .times(times)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .pipe(
              catchError((error) => {
                console.error('Error loading times:', error); //FXIME: handle in toast message
                return EMPTY;
              })
            )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.timeModels$ = this.searchCriteria.pipe(
      switchMap((criteria) =>
        this.cubeService.search(criteria).pipe(
          catchError((error) => {
            console.error('Search error:', error); //FIXME: handle in toast message
            return of([]);
          })
        )
      )
    );
  }

  public onDateChange(date: Date): void {
    this.searchCriteria.next({
      dateFrom: this.getDefaultDateFrom(date.getFullYear(), date.getMonth()),
      dateTo: this.getDefaultDateTo(date.getFullYear(), date.getMonth()),
    });
    this.date.next(date);
  }

  private mapFromMcu(mcu: McuTimeModel): TimeModel {
    const intervals = mcu.intervals.map((i) => ({
      start: this.rtcToDate(i.start),
      end: i.end ? this.rtcToDate(i.end) : null,
    }));

    return {
      displayId: mcu.displayId,
      label: mcu.label,
      intervals: intervals.map(
        (i) => ({ end: i.end?.toISOString(), start: i.start.toISOString() } as IntervalModel)
      ),
      timeZoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private rtcToDate(rtc: RtcTime): Date {
    return new Date(Date.UTC(rtc.year, rtc.month - 1, rtc.day, rtc.hour, rtc.minute, rtc.second));
  }

  private getDefaultDateFrom(year?: number, month?: number): string {
    const currentDate = new Date();
    const date = new Date(year ?? currentDate.getFullYear(), month ?? currentDate.getMonth(), 1);

    return this.formatDate(date);
  }

  private getDefaultDateTo(year?: number, month?: number): string {
    const currentDate = new Date();
    const date = new Date(
      year ?? currentDate.getFullYear(),
      (month ?? currentDate.getMonth()) + 1,
      0
    );

    return this.formatDate(date);
  }

  private formatDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split('T')[0];
  }
}
