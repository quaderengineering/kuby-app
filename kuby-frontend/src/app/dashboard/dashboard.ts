import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IntervalModelFE, McuTimeModel, RtcTime, TimeModelFE } from './dashboard.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { tr } from 'primelocale/js/tr.js';

interface IntervalEditForm {
  start: FormControl<Date | undefined | null>;
  end: FormControl<Date | undefined | null>;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    Ripple,
    DatePickerModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public readonly isModalInEditMode = signal(false);

  public readonly modalVisible = signal(false);

  public date = new BehaviorSubject<Date>(new Date());

  public timeModels$?: Observable<TimeViewModel[]>;

  public rawTimeModels$ = new BehaviorSubject<TimeModelFE[] | undefined>(undefined);

  public editForm: FormGroup<IntervalEditForm> | null = null;

  public get startControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.start;
  }

  public get endControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.end;
  }

  private searchCriteria = new BehaviorSubject<CubeTimeSearchModel>({
    dateFrom: this.getDefaultDateFrom(),
    dateTo: this.getDefaultDateTo(),
  });

  private intervalIdCounter = 0;

  private editingIntervalId: number | undefined = undefined;

  private readonly cubeService = inject(CubeClient);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.http
      .get<McuTimeModel[]>('/timemock.json')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((raw) => raw.map((mcu) => this.mapFromMcu(mcu))),
        tap((times) => {
          this.rawTimeModels$.next(times);
          this.modalVisible.set(true);
        })
      )
      .subscribe();

    this.timeModels$ = this.searchCriteria.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((criteria) =>
        this.cubeService.search(criteria).pipe(
          takeUntilDestroyed(this.destroyRef),
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

  public onModalSave(): void {
    console.log(this.rawTimeModels$.value);

    const timeModelsToSave: TimeModel[] = this.rawTimeModels$.value!.map(
      ({ intervalsFE, ...rest }) => ({
        ...rest,
        intervals: this.mapFromIntervalsFE(intervalsFE!),
      })
    );

    console.log(timeModelsToSave);

    this.cubeService
      .times(timeModelsToSave)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error loading times:', error); //FXIME: handle in toast message
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.modalVisible.set(false);
          this.rawTimeModels$.next(undefined);
        },
      });
  }

  public isEditing(interval: IntervalModelFE): boolean {
    return this.editingIntervalId === interval.intervalId;
  }

  public startEdit(interval: IntervalModelFE): void {
    this.editingIntervalId = interval.intervalId;
    this.isModalInEditMode.set(true);

    this.editForm = new FormGroup<IntervalEditForm>({
      start: new FormControl<Date | undefined>(interval.start, { nonNullable: false }),
      end: new FormControl<Date | undefined>(interval.end, { nonNullable: false }),
    });
  }

  public cancelEdit(): void {
    this.editForm = null;
    this.editingIntervalId = undefined;
    this.isModalInEditMode.set(false);
  }

  public saveEdit(interval: IntervalModelFE): void {
    if (!this.editForm) return;

    const formValue = this.editForm.value;

    const updatedInterval: IntervalModelFE = {
      ...interval,
      start: formValue.start ?? undefined,
      end: formValue.end ?? undefined,
    };

    this.rawTimeModels$.next(
      this.rawTimeModels$.value?.map((tm) => ({
        ...tm,
        intervalsFE: tm.intervalsFE?.map((i) =>
          i.intervalId === interval.intervalId ? updatedInterval : i
        ),
      }))
    );

    this.editForm = null;
    this.editingIntervalId = undefined;
    this.isModalInEditMode.set(false);
  }

  public stringToDate(stringDate: string): Date {
    return new Date(stringDate);
  }

  private mapFromMcu(mcu: McuTimeModel): TimeModelFE {
    const intervals: IntervalModelFE[] = mcu.intervals.map((i) => ({
      intervalId: ++this.intervalIdCounter,
      start: this.rtcToDate(i.start),
      end: i.end ? this.rtcToDate(i.end) : undefined,
      duration: 0,
      timeId: 0,
    }));

    return {
      displayId: mcu.displayId,
      label: mcu.label,
      intervalsFE: intervals,
      timeZoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private mapFromIntervalsFE(intervalsFE: IntervalModelFE[]): IntervalModel[] {
    return intervalsFE.map(
      (intervalFE) =>
        ({
          intervalId: 0,
          timeId: 0,
          start: intervalFE.start?.toISOString(),
          end: intervalFE.end?.toISOString(),
        } as IntervalModel)
    );
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
