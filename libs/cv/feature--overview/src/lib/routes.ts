import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./cv-overview-page'),
  },
] satisfies Route[];
