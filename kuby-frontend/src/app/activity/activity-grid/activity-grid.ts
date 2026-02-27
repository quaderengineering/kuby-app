import { CommonModule } from '@angular/common';
import { Component, input, output, signal, viewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ActivityViewModel } from '../../services/api-service';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-activity-grid',
  imports: [CommonModule, TableModule, ContextMenuModule, MenuModule, ButtonModule],
  templateUrl: './activity-grid.html',
  styleUrl: './activity-grid.scss',
})
export class ActivityGrid {
  public readonly activities = input<ActivityViewModel[]>();

  public readonly onEditActivity = output<string>();

  public readonly onDeleteActivity = output<string>();

  public readonly selectedActivity = signal<ActivityViewModel | undefined>(undefined);

  public readonly contextMenuCommands = signal<MenuItem[]>(this.getMenuItems());

  private readonly contextMenu = viewChild<ContextMenu>('cm');
  private readonly menu = viewChild<Menu>('menu');

  public onContextMenuShow(): void {
    this.menu()?.hide();
  }

  public onContextMenuHide(): void {
    this.selectedActivity.set(undefined);
  }

  public onMenuShow(activity: ActivityViewModel): void {
    this.contextMenu()?.hide();
    this.selectedActivity.set(activity);
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
