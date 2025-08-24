import type { Provider } from '@angular/core';
import { CvApi } from './api/cv-api';
import { CvStore } from './store/cv-store';

export function provideCvData() {
  return [CvApi, CvStore] satisfies Provider[];
}
