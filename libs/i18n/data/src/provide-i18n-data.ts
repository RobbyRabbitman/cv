import type { Provider } from '@angular/core';
import { I18n } from './store/i18n-store';

export function provideI18nData() {
  return [I18n] satisfies Provider[];
}
