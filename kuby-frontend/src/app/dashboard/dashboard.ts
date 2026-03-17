import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {DateRange, DateRangeMode,} from './dashboard.models';
import {BehaviorSubject, catchError, Observable, of, switchMap} from 'rxjs';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {
  ActivityClient,
  ActivityTimeEntrySearchModel,
  ActivityViewModel,
  TimeEntryClient,
} from '../services/api-service';
import {SelectModule} from 'primeng/select';
import {MonthView} from './month-view/month-view';
import {SelectButton} from 'primeng/selectbutton';
import {WeekView} from './week-view/week-view';
import {DayView} from './day-view/day-view';

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
    MonthView,
    SelectButton,
    WeekView,
    DayView,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public date$ = new BehaviorSubject<Date>(new Date());
  public activities$?: Observable<ActivityViewModel[]>;

  public readonly dateRanges = signal(this.getDateRanges());
  public readonly selectedDateRangeMode = signal<DateRangeMode>(DateRangeMode.WEEK);
  public readonly viewForDatePicker = computed(() => this.selectedDateRangeMode() === DateRangeMode.MONTH ? "month" : "date");

  protected readonly DateRangeMode = DateRangeMode;

  private searchCriteria = new BehaviorSubject<ActivityTimeEntrySearchModel>({
    dateFrom: this.getDefaultDateFrom(),
    dateTo: this.getDefaultDateTo(),
  });

  private readonly activityService = inject(ActivityClient);
  private readonly timeEntryService = inject(TimeEntryClient);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
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

  public onMoveDateBackward(): void {
    switch(this.selectedDateRangeMode()) {
      case DateRangeMode.DAY:
        this.changeDay(-1);
        break;
      case DateRangeMode.WEEK:
        this.moveOneWeekBackward();
        break;
      case DateRangeMode.MONTH:
        this.changeMonth(1);
    }
  }

  public onMoveDateForward(): void {
    switch(this.selectedDateRangeMode()) {
      case DateRangeMode.DAY:
        this.changeDay(1);
        break;
      case DateRangeMode.WEEK:
        this.moveOneWeekForward();
        break;
      case DateRangeMode.MONTH:
        this.changeMonth(1);
    }
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

  getDateFormat(): string {
    switch(this.selectedDateRangeMode()) {
      case DateRangeMode.DAY:
      case DateRangeMode.WEEK:
        return 'dd. MM yy';
      case DateRangeMode.MONTH:
        return 'MM yy';
      default:
        return 'dd.MM yy';
    }
  }

  private changeDay(value: number): void {
    const date = this.date$.value;
    this.onDateChange(new Date(date.setDate(date.getDate() + value)));
  }

  private moveOneWeekBackward(): void {
    this.changeDay(-7);
  }

  private moveOneWeekForward(): void {
    this.changeDay(7);
  }

  private changeMonth(value: number): void {
    const date = this.date$.value;
    this.onDateChange(new Date(date.setMonth(date.getMonth() + value)));
  }

  private getDateRanges(): DateRange[] {
    return [{value: DateRangeMode.DAY, label: "Tag"},{value: DateRangeMode.WEEK, label: "Woche"},{value: DateRangeMode.MONTH, label: "Monat"}]
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
