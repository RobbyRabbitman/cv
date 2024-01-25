import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./cv-edit-page'),
    title: 'CV.EDIT.TITLE',
  },
] satisfies Route[];
