import type { Provider } from '@angular/core';
import { provideI18nApiTesting } from './api/provide-i18n-api-testing';

export function provideI18nDataTesting() {
  return [...provideI18nApiTesting()] satisfies Provider[];
}
