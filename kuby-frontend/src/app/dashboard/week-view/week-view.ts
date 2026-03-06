import {Component, input, OnChanges, OnInit, signal} from '@angular/core';
import {ActivityViewModel} from '../../services/api-service';
import {DaySummary, DayViewModel, WeekViewModel} from '../dashboard.models';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-week-view',
  imports: [CommonModule],
  templateUrl: './week-view.html',
  styleUrl: './week-view.scss'
})
export class WeekView implements OnChanges {
  public readonly activities = input.required<ActivityViewModel[]>();
  public readonly selectedDate = input.required<Date>();

  public readonly viewModel = signal<WeekViewModel | undefined>(undefined);

  public ngOnChanges(): void {
    if (this.activities) {
      this.viewModel.set(this.transformToWeekView(this.activities(), this.selectedDate()));
    }
  }

  private transformToWeekView(
    activities: ActivityViewModel[],
    weekDate: Date
  ): WeekViewModel {
    const weekStart = this.getWeekStart(new Date(weekDate));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Generate 7 days
    const days: DaySummary[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);

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

    // Calculate activity totals across the week
    const activityTotalsMap = new Map<string, { name: string; color: string; hours: number }>();

    activities.forEach(activity => {
      const weekEntries = (activity.timeEntries || []).filter(entry => {
        const entryDate = new Date(entry.start!);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });

      const totalHours = weekEntries.reduce((sum, entry) => {
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

    const totalWeekHours = Array.from(activityTotalsMap.values())
      .reduce((sum, a) => sum + a.hours, 0);

    const activityTotals = Array.from(activityTotalsMap.entries()).map(([id, data]) => ({
      activityId: id,
      name: data.name,
      color: data.color,
      totalHours: parseFloat(data.hours.toFixed(1)),
      percentage: totalWeekHours > 0 ? (data.hours / totalWeekHours) * 100 : 0
    }));

    return {
      weekStart,
      weekEnd,
      days,
      activityTotals,
      totalDuration: this.formatDuration(totalWeekHours * 3600000)
    };
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
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
