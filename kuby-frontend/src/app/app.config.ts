import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from './services/demo-service';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_BASE_URL, useValue: 'http://localhost:5000' },
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
