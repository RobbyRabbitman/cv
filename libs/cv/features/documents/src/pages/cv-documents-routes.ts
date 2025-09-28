import { type Routes } from '@angular/router';
import { authGuard } from '@robby-rabbitman/cv-libs-auth-components';

export const CV_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'cv.documents.page.title',
    loadComponent: () => import('./cv-documents-page'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
