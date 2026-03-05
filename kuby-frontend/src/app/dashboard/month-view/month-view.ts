import { Component, input, signal } from '@angular/core';
import { MonthViewModel } from '../dashboard.models';
import { ActivityViewModel } from '../../services/api-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-month-view',
  imports: [DatePipe],
  templateUrl: './month-view.html',
  styleUrl: './month-view.scss',
})
export class MonthView {
  public readonly activities = input.required<ActivityViewModel[]>();

  public readonly monthActivities = signal<MonthViewModel | undefined>(undefined);
}
