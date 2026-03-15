import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ButtonModule, MenubarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  public items: MenuItem[] | undefined;

  public ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-table',
        routerLink: '/dashboard',
      },
      { label: 'Aktivitäten', icon: 'pi pi-list', routerLink: '/activity' },
      { label: 'Upload', icon: 'pi pi-upload', routerLink: '/upload' },
    ];

    // (window as any).electron?.receive('usb-data-response', (data: any) => {
    //   console.log('USB data:', data);
    // });
  }

  public testIpc() {
    // (window as any).electron.send('get-usb-data-2');
  }

  public async testIpc2() {
    await (window as any).electron.invoke('get-usb-data-2').then((data: any) => console.log(data));
  }
}
