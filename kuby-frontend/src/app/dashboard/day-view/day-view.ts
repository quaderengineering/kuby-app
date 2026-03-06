import {Component, input, OnChanges, signal} from '@angular/core';
import {ActivityViewModel} from '../../services/api-service';
import {ActivityDayDetail, DayViewModel} from '../dashboard.models';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-day-view',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './day-view.html',
  styleUrl: './day-view.scss',
})
export class DayView implements OnChanges {
  public readonly activities = input.required<ActivityViewModel[]>();
  public readonly selectedDate = input.required<Date>();

  public readonly viewModel = signal<DayViewModel | undefined>(undefined);

  public ngOnChanges(): void {
    if (this.activities()) {
      this.viewModel.set(this.transformToDayView(this.activities(), this.selectedDate()));
    }
  }

  private transformToDayView(activities: ActivityViewModel[], date: Date): DayViewModel {
    console.log('og date', date.toISOString());

    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const activityDetails = activities
      .map((activity) => {
        // Filter entries for this specific day
        const dayEntries = (activity.timeEntries || []).filter((entry) => {
          const entryDate = new Date(entry.start!);
          console.log('entrydate', entryDate.toISOString());
          console.log('start', dayStart.toISOString());
          console.log('end', dayEnd.toISOString());

          return entryDate >= dayStart && entryDate <= dayEnd;
        });

        console.log('dayentries', dayEntries);

        const totalMs = dayEntries.reduce((sum, entry) => {
          const start = new Date(entry.start!);
          const end = new Date(entry.end!);
          return sum + (end.getTime() - start.getTime());
        }, 0);

        const a = {
          activityId: activity.activityId!,
          activityName: activity.label!,
          color: this.getActivityColor(activity),
          timeEntries: dayEntries.map((entry) => ({
            timeEntryId: entry.timeEntryId!.toString(),
            start: new Date(entry.start!),
            end: new Date(entry.end!),
            duration: this.formatDuration(
              new Date(entry.end!).getTime() - new Date(entry.start!).getTime()
            ),
          })),
          totalDuration: this.formatDuration(totalMs),
        } as ActivityDayDetail;

        console.log(a);

        return a;
      })
      .filter((a) => a.timeEntries.length > 0); // Only show activities with entries

    const totalMs = activityDetails.reduce((sum, a) => {
      return (
        sum +
        a.timeEntries.reduce((s, e) => {
          return s + (e.end.getTime() - e.start.getTime());
        }, 0)
      );
    }, 0);

    return {
      date,
      activities: activityDetails,
      totalDuration: this.formatDuration(totalMs),
    };
  }

  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  private getActivityColor(activity: ActivityViewModel): string {
    // Use a default color if not provided
    return this.generateColorFromId(activity.activityId!);
  }

  private generateColorFromId(id: string): string {
    // Simple hash-based color generation
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}
