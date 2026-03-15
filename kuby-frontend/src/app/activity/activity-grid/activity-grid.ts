import {CommonModule} from '@angular/common';
import {Component, input, output, signal, viewChild,} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ActivityViewModel} from '../../services/api-service';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MenuItem} from 'primeng/api';
import {Menu, MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';

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

  public readonly hideContextMenu = signal(false);

  // private readonly table = viewChild<Table>('table');

  public readonly isSorted = signal<boolean | undefined>(undefined);

  private readonly menu = viewChild<Menu>('menu');

  public onContextMenuShow(): void {
    this.hideContextMenu.set(false);
    // FIXME: cant hide menu somehow
    this.menu()?.hide();
  }

  public onContextMenuHide(): void {
    this.selectedActivity.set(undefined);
  }

  public onMenuShow(activity: any): void {
    console.log(activity);
    this.hideContextMenu.set(true);
    this.selectedActivity.set(activity);
  }

  // public customSort(event: SortEvent) {
  //   console.log(event);

  //   if (this.isSorted() === undefined) {
  //     this.isSorted.set(true);
  //     // this.sortTableData(event);
  //   } else if (this.isSorted() == true) {
  //     this.isSorted.set(false);
  //     // this.sortTableData(event);
  //   } else if (this.isSorted() == false) {
  //     this.isSorted.set(undefined);
  //     // this.products = [...this.initialValue];
  //     this.table()?.reset();
  //   }
  // }

  private editActivity(): void {
    if (this.selectedActivity()?.activityId)
      this.onEditActivity.emit(this.selectedActivity()?.activityId!);
  }

  private deleteActivity(): void {
    console.log(this.selectedActivity()?.activityId)
    if (this.selectedActivity()?.activityId)
      this.onDeleteActivity.emit(this.selectedActivity()?.activityId!);
  }

  private getMenuItems(): MenuItem[] {
    return [
      { label: 'Bearbeiten', icon: 'pi pi-fw pi-pencil', command: () => this.editActivity() },
      { label: 'Löschen', icon: 'pi pi-fw pi-trash', command: () => this.deleteActivity() },
    ];
  }
}
