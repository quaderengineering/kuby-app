import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Client, WeatherForecast } from './services/demo-service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
public demoData?: Observable<WeatherForecast[] | null>;

  protected readonly title = signal('kuby-frontend');

  private readonly demoService = inject(Client);

  public getData() {
    this.demoData = this.demoService.getWeatherForecast();
  }

  public removeData() {
    this.demoData = of(null)
  }
}
