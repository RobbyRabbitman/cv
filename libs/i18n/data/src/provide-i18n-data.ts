import type { Provider } from '@angular/core';
import { I18nApi } from './api/i18n-api';
import { I18n } from './store/i18n-store';

export function provideI18nData() {
  return [I18n, I18nApi] satisfies Provider[];
}
