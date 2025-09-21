import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from './services/demo-service';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeuix/themes/aura';
import { Noir } from './primeng-custom-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Noir
      },
    }),
    { provide: API_BASE_URL, useValue: 'http://localhost:5000' },
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
