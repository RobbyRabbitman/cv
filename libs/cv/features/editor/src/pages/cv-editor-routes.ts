import { type Routes } from '@angular/router';
import { authGuard } from '@robby-rabbitman/cv-libs-auth-components';

export const CV_EDITOR_ROUTE_PARAMETERS = {
  cvId: 'cvId',
} as const;

export const CV_EDITOR_ROUTES: Routes = [
  {
    path: `:${CV_EDITOR_ROUTE_PARAMETERS.cvId}`,
    title: 'cv.editor.page.title',
    loadComponent: () => import('./cv-editor-page'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
