import { type Routes } from '@angular/router';
import { provideFeatureBasePath } from '@robby-rabbitman/cv-libs-common-util';

export const CV_APP_ROUTES = [
  {
    path: 'documents',
    loadChildren: () =>
      import('@robby-rabbitman/cv-libs-cv-features-documents').then(
        ({ CV_DOCUMENTS_ROUTES }) => CV_DOCUMENTS_ROUTES,
      ),
    providers: [provideFeatureBasePath('documents')],
  },
] as const satisfies Routes;
