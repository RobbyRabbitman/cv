import { type Routes } from '@angular/router';
import { authGuard } from '@robby-rabbitman/cv-libs-auth-components';

export const CV_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cv-documents-page'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
