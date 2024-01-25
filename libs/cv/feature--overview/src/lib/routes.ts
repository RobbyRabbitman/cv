import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./cv-overview-page'),
    title: 'CV.OVERVIEW.TITLE',
  },
] satisfies Route[];
