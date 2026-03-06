import {Component, input, OnChanges, signal} from '@angular/core';
import {ActivityTotal, MonthDay, MonthViewModel} from '../dashboard.models';
import {ActivityViewModel} from '../../services/api-service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-month-view',
  imports: [DatePipe],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView implements OnChanges {
  public readonly activities = input.required<ActivityViewModel[]>();
  public readonly selectedDate = input.required<Date>();

  public readonly viewModel = signal<MonthViewModel | undefined>(undefined);

  public ngOnChanges(): void {
    if (this.activities) {
      this.viewModel.set(this.transformToMonthView(this.activities(), this.selectedDate()));
    }
  }

  public isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  public getHeatmapColor(hours: number): string {
    if (hours === 0) return 'transparent';
    if (hours < 2) return '#e8f5e9';
    if (hours < 4) return '#a5d6a7';
    if (hours < 6) return '#66bb6a';
    if (hours < 8) return '#43a047';
    return '#2e7d32';
  }

  private transformToMonthView(
    activities: ActivityViewModel[],
    monthDate: Date
  ): MonthViewModel {
    const month = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const firstDay = new Date(month);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const days: MonthDay[] = [];

    // Add padding for days before month starts
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push({date: null, totalHours: 0, activities: []});
    }

    // Add actual month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayActivities = activities.map(activity => {
        const dayEntries = (activity.timeEntries || []).filter(entry => {
          const entryDate = new Date(entry.start!);
          return entryDate >= dayStart && entryDate <= dayEnd;
        });

        const hours = dayEntries.reduce((sum, entry) => {
          const start = new Date(entry.start!);
          const end = new Date(entry.end!);
          return sum + (end.getTime() - start.getTime()) / 3600000;
        }, 0);

        return {
          activityId: activity.activityId!,
          name: activity.label!,
          color: this.getActivityColor(activity),
          hours: parseFloat(hours.toFixed(1))
        };
      }).filter(a => a.hours > 0);

      const totalHours = dayActivities.reduce((sum, a) => sum + a.hours, 0);

      days.push({
        date: new Date(date),
        totalHours: parseFloat(totalHours.toFixed(1)),
        activities: dayActivities
      });
    }

    const activityTotalsMap = new Map<string, { name: string; color: string; hours: number }>();

    activities.forEach(activity => {
      const monthEntries = (activity.timeEntries || []).filter(entry => {
        const entryDate = new Date(entry.start!);
        return entryDate >= firstDay && entryDate <= lastDay;
      });

      const totalHours = monthEntries.reduce((sum, entry) => {
        const start = new Date(entry.start!);
        const end = new Date(entry.end!);
        return sum + (end.getTime() - start.getTime()) / 3600000;
      }, 0);

      if (totalHours > 0) {
        activityTotalsMap.set(activity.activityId!, {
          name: activity.label!,
          color: this.getActivityColor(activity),
          hours: totalHours
        });
      }
    });

    const totalMonthHours = Array.from(activityTotalsMap.values())
      .reduce((sum, a) => sum + a.hours, 0);

    const activityTotals = Array.from(activityTotalsMap.entries()).map(([id, data]) => ({
      activityId: id,
      name: data.name,
      color: data.color,
      totalHours: parseFloat(data.hours.toFixed(1)),
      percentage: totalMonthHours > 0 ? (data.hours / totalMonthHours) * 100 : 0
    } as ActivityTotal));

    return {
      month: month,
      days: days,
      activityTotals: activityTotals,
      totalDuration: this.formatDuration(totalMonthHours * 3600000)
    } as MonthViewModel;
  }

  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  private getActivityColor(activity: ActivityViewModel): string {
    return this.generateColorFromId(activity.activityId!);
  }

  private generateColorFromId(id: string): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}
