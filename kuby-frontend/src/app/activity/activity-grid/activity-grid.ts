import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ActivityViewModel } from '../../services/api-service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-activity-grid',
  imports: [CommonModule, TableModule, ContextMenuModule],
  templateUrl: './activity-grid.html',
  styleUrl: './activity-grid.scss',
})
export class ActivityGrid {
  public readonly activities = input<ActivityViewModel[]>();

  public readonly onEditActivity = output<string>();

  public readonly onDeleteActivity = output<string>();

  public readonly selectedActivity = signal<ActivityViewModel | undefined>(undefined);

  public readonly contextMenuCommands = signal<MenuItem[]>(this.getMenuItems());

  public onContextMenuHide(): void {
    this.selectedActivity.set(undefined);
  }

  private editActivity(): void {
    if (this.selectedActivity()?.activityId)
      this.onEditActivity.emit(this.selectedActivity()?.activityId!);
  }

  private deleteActivity(): void {
    if (this.selectedActivity()?.activityId)
      this.onDeleteActivity.emit(this.selectedActivity()?.activityId!);
  }

  private getMenuItems(): MenuItem[] {
    return [
      { label: 'Bearbeiten', icon: 'pi pi-fw pi-pencil', command: () => this.editActivity() },
      { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.deleteActivity() },
    ];
  }
}
