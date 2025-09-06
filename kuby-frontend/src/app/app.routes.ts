import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'demo',
    loadComponent: () =>
      import('./demo/demo').then((m) => m.Demo),
  },
];
