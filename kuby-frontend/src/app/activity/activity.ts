import {Component, DestroyRef, inject, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ActivityClient, ActivityModel, ActivityViewModel} from '../services/api-service';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {combineLatest, Observable, switchMap} from 'rxjs';
import {CommonModule} from '@angular/common';
import {SplitterModule} from 'primeng/splitter';
import {ActivityGrid} from './activity-grid/activity-grid';
import {Ripple} from 'primeng/ripple';
import {SelectModule} from 'primeng/select';
import {StateModel} from './activity.models';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {ActivityEditor} from './activity-editor/activity-editor';

@Component({
  selector: 'app-activity',
  imports: [
    CommonModule,
    TableModule,
    DatePickerModule,
    FormsModule,
    SplitterModule,
    ActivityGrid,
    ButtonModule,
    Ripple,
    SelectModule,
    ActivityEditor,
  ],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity {
  public readonly rangeDates = signal<Date[]>([this.getDefaultDateFrom(), this.getDefaultDateTo()]);

  public readonly activities$: Observable<ActivityViewModel[]>;

  public readonly isEditorOpen = signal(false);

  public readonly activityToEdit = signal<ActivityModel | undefined>(undefined);

  protected readonly states: StateModel[] = [
    { name: 'Aktiv', value: true },
    { name: 'Gelöscht', value: false },
  ];

  protected readonly selectedState = signal<StateModel>(this.states[0]);

  private readonly reloadData = signal(0);

  private readonly activityService = inject(ActivityClient);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.activities$ = combineLatest([
      toObservable(this.selectedState),
      toObservable(this.reloadData),
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(([state, _]) => this.activityService.search(state.value))
    );
  }

  public onAdd(): void {
    this.activityToEdit.set(undefined);
    this.isEditorOpen.set(true);
  }

  public onClose(): void {
    this.isEditorOpen.set(false);
  }

  public onEdit(activityId: string): void {
    this.activityService
      .activitiesGet(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (activity) => {
          this.activityToEdit.set(activity);
          this.isEditorOpen.set(true);
        },
        error: (error) => console.error(error),
      });
  }

  public onSubmit(activity: ActivityModel): void {
    this.activityService
      .activitiesPost([activity])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.reloadData.update(value => value + 1);
          this.onClose();
        },
        error: (error) => console.error(error),
      });
  }

  public onDelete(activityId: string): void {
    this.activityService
      .activitiesDelete(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.reloadData.update(value => value + 1), error: (error) => console.error(error) });
  }

  private getDefaultDateFrom(year?: number, month?: number): Date {
    const currentDate = new Date();
    return new Date(year ?? currentDate.getFullYear(), month ?? currentDate.getMonth(), 1);
  }

  private getDefaultDateTo(year?: number, month?: number): Date {
    const currentDate = new Date();
    return new Date(year ?? currentDate.getFullYear(), (month ?? currentDate.getMonth()) + 1, 0);
  }

  private formatDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split('T')[0];
  }
}
