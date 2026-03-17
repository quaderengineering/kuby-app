import {Component, DestroyRef, inject, OnInit, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {DatePickerModule} from 'primeng/datepicker';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import {BehaviorSubject, map, tap} from 'rxjs';
import {
  ActivityModelFE,
  McuTimeModel,
  RtcTime,
  TimeEntryEditForm,
  TimeEntryModelFE
} from '../dashboard/dashboard.models';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {ActivityClient, ActivityModel, TimeEntryClient, TimeEntryModel} from '../services/api-service';

@Component({
  selector: 'app-cube-data-dialog',
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    Ripple,
    DatePickerModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './cube-data-dialog.html',
  styleUrl: './cube-data-dialog.scss'
})
export class CubeDataDialog implements OnInit {
  public modalClosed = output();

  public rawActivityModels$ = new BehaviorSubject<ActivityModelFE[] | undefined>(undefined);

  public editForm: FormGroup<TimeEntryEditForm> | null = null;

  public readonly modalVisible = signal(false);
  public readonly isModalInEditMode = signal(false);

  protected readonly timeZones = Intl.supportedValuesOf('timeZone');

  private timeEntryIdCounter = 0;
  private editingTimeEntryId: number | undefined = undefined;
  // FIXME: only because mock.json
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activityService = inject(ActivityClient);
  private readonly timeEntryService = inject(TimeEntryClient);

  public get startControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.start;
  }

  public get endControl(): FormControl<Date | undefined | null> {
    return this.editForm!.controls.end;
  }

  public get timeZoneControl(): FormControl<string | undefined | null> {
    return this.editForm!.controls.timeZoneInfo;
  }

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
  }

  public onModalSave(): void {
    const activityModelsToSave: ActivityModel[] = this.rawActivityModels$.value!.map(
      ({ timeEntriesFE: timeEntriesFE, ...rest }) => ({
        ...rest,
        timeEntries: this.mapFromTimeEntriesFE(timeEntriesFE!),
      })
    );

    // FIXME: temporary
    console.log(activityModelsToSave);
    this.modalVisible.set(false);
    this.modalClosed.emit();
    this.rawActivityModels$.next(undefined);

    // this.activityService
    //   .importCubeData(activityModelsToSave)
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     catchError((error) => {
    //       console.error('Error loading times:', error); //FXIME: handle in toast message
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.modalVisible.set(false);
    //       this.rawActivityModels$.next(undefined);
    //     },
    //   });
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
}
