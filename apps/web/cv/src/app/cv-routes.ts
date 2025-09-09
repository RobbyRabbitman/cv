import { type Routes } from '@angular/router';
import { CV_DOCUMENTS_ROUTES } from '@robby-rabbitman/cv-libs-cv-features-documents';

export const CV_APP_ROUTES = [
  {
    path: 'documents',
    children: CV_DOCUMENTS_ROUTES,
  },
] satisfies Routes;
