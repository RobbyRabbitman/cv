import { type Routes } from '@angular/router';
import { authGuard } from '@robby-rabbitman/cv-libs-auth-components';
import { provideFeatureBasePath } from '@robby-rabbitman/cv-libs-common-util';

export const CV_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'cv.documents.page.title',
    loadComponent: () => import('./cv-documents-page'),
    canActivate: [authGuard],
  },
  {
    path: 'edit',
    loadChildren: () =>
      import('@robby-rabbitman/cv-libs-cv-features-editor').then(
        ({ CV_EDITOR_ROUTES }) => CV_EDITOR_ROUTES,
      ),
    canActivate: [authGuard],
    providers: [provideFeatureBasePath('edit')],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
