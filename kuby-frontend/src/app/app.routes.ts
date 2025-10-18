import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./cube-icon-uploader/cube-icon-uploader').then((m) => m.CubeIconUploader),
  },
];
