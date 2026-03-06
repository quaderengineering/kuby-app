import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  TimeEntryModelFE,
  McuTimeModel,
  RtcTime,
  ActivityModelFE,
  TimeEntryEditForm,
  MonthViewModel,
} from './dashboard.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
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
import {
  ActivityClient,
  ActivityModel,
  ActivityTimeEntrySearchModel,
  ActivityViewModel,
  TimeEntryClient,
  TimeEntryModel,
} from '../services/api-service';
import { SelectModule } from 'primeng/select';
import { MonthView } from './month-view/month-view';
import { DayView } from './day-view/day-view';
import {WeekView} from './week-view/week-view';

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
    SelectModule,
    DayView,
    WeekView,
    MonthView,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public readonly isModalInEditMode = signal(false);

  public readonly modalVisible = signal(false);

  public date$ = new BehaviorSubject<Date>(new Date());

  public activities$?: Observable<ActivityViewModel[]>;

  public rawActivityModels$ = new BehaviorSubject<ActivityModelFE[] | undefined>(undefined);

  public editForm: FormGroup<TimeEntryEditForm> | null = null;

  public get startControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.start;
  }

  public get endControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.end;
  }

  public get timeZoneControl(): FormControl<string | undefined | null> {
    return this.editForm!.controls.timeZoneInfo;
  }

  protected timeZones = Intl.supportedValuesOf('timeZone');

  private searchCriteria = new BehaviorSubject<ActivityTimeEntrySearchModel>({
    dateFrom: this.getDefaultDateFrom(),
    dateTo: this.getDefaultDateTo(),
  });

  private timeEntryIdCounter = 0;

  private editingTimeEntryId: number | undefined = undefined;

  private readonly activityService = inject(ActivityClient);
  private readonly timeEntryService = inject(TimeEntryClient);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.http
      .get<McuTimeModel[]>('/timemock.json')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((raw) => raw.map((mcu) => this.mapFromMcu(mcu))),
        tap((times) => {
          this.rawActivityModels$.next(times);
          this.modalVisible.set(true);
        })
      )
      .subscribe();

    this.activities$ = this.searchCriteria.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((criteria) =>
        this.timeEntryService.search(criteria).pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            console.error('Search error:', error); //FIXME: handle in toast message
            return of([]);
          })
        )
      )
    );
  }

  public onChangeMonth(value: number): void {
    const date = this.date$.value;
    this.onDateChange(new Date(date.setMonth(date.getMonth() + value)));
  }

  public onChangeDateToToday(): void {
    this.onDateChange(new Date());
  }

  public onDateChange(date: Date): void {
    this.searchCriteria.next({
      dateFrom: this.getDefaultDateFrom(date.getFullYear(), date.getMonth()),
      dateTo: this.getDefaultDateTo(date.getFullYear(), date.getMonth()),
    });
    this.date$.next(date);
  }

  public onModalSave(): void {
    const activityModelsToSave: ActivityModel[] = this.rawActivityModels$.value!.map(
      ({ timeEntriesFE: timeEntriesFE, ...rest }) => ({
        ...rest,
        timeEntries: this.mapFromTimeEntriesFE(timeEntriesFE!),
      })
    );

    this.activityService
      .importCubeData(activityModelsToSave)
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
          this.rawActivityModels$.next(undefined);
        },
      });
  }

  public isEditing(timeEntry: TimeEntryModelFE): boolean {
    return this.editingTimeEntryId === timeEntry.timeEntryId;
  }

  public startEdit(timeEntry: TimeEntryModelFE): void {
    this.editingTimeEntryId = timeEntry.timeEntryId;
    this.isModalInEditMode.set(true);

    this.editForm = new FormGroup<TimeEntryEditForm>({
      start: new FormControl<Date | undefined>(timeEntry.start, { nonNullable: false }),
      end: new FormControl<Date | undefined>(timeEntry.end, { nonNullable: false }),
      timeZoneInfo: new FormControl<string | undefined | null>(timeEntry.timeZoneInfo, {
        nonNullable: false,
      }),
    });
  }

  public cancelEdit(): void {
    this.editForm = null;
    this.editingTimeEntryId = undefined;
    this.isModalInEditMode.set(false);
  }

  public saveEdit(timeEntry: TimeEntryModelFE): void {
    if (!this.editForm) return;

    const formValue = this.editForm.value;

    const updatedTimeEntry: TimeEntryModelFE = {
      ...timeEntry,
      start: formValue.start ?? undefined,
      end: formValue.end ?? undefined,
      timeZoneInfo: formValue.timeZoneInfo ?? undefined,
    };

    this.rawActivityModels$.next(
      this.rawActivityModels$.value?.map((tm) => ({
        ...tm,
        timeEntriesFE: tm.timeEntriesFE?.map((t) =>
          t.timeEntryId === timeEntry.timeEntryId ? updatedTimeEntry : t
        ),
      }))
    );

    this.editForm = null;
    this.editingTimeEntryId = undefined;
    this.isModalInEditMode.set(false);
  }

  public stringToDate(stringDate: string): Date {
    return new Date(stringDate);
  }

  private mapFromMcu(mcu: McuTimeModel): ActivityModelFE {
    const timeEntries: TimeEntryModelFE[] = mcu.intervals.map((i) => ({
      timeEntryId: ++this.timeEntryIdCounter,
      start: this.rtcToDate(i.start),
      end: i.end ? this.rtcToDate(i.end) : undefined,
      timeZoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
      duration: 0,
      timeId: 0,
    }));

    return {
      label: mcu.label,
      timeEntriesFE: timeEntries,
    };
  }

  private mapFromTimeEntriesFE(timeEntriesFE: TimeEntryModelFE[]): TimeEntryModel[] {
    return timeEntriesFE.map(
      (timeEntryFE) =>
        ({
          timeEntryId: 0,
          timeId: 0,
          start: timeEntryFE.start?.toISOString(),
          end: timeEntryFE.end?.toISOString(),
          timeZoneInfo: timeEntryFE.timeZoneInfo,
        } as TimeEntryModel)
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
