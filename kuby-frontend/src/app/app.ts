import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Client, WeatherForecast } from './services/demo-service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ButtonModule, MenubarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  public demoData?: Observable<WeatherForecast[] | null>;

  public items: MenuItem[] | undefined;

  protected readonly title = signal('kuby-frontend');

  private readonly demoService = inject(Client);

  public ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-table',
        routerLink: '/dashboard',
      },
      { label: 'Upload', icon: 'pi pi-upload', routerLink: '/upload' },
    ];

    // (window as any).electron?.receive('usb-data-response', (data: any) => {
    //   console.log('USB data:', data);
    // });
  }

  public getData() {
    this.demoData = this.demoService.getWeatherForecast();
  }

  public testIpc() {
    this.demoData = of(null);

    // (window as any).electron.send('get-usb-data-2');
  }

  public async testIpc2() {
    await (window as any).electron.invoke('get-usb-data-2').then((data: any) => console.log(data));
  }
}
