import {
  effect,
  inject,
  provideEnvironmentInitializer,
  untracked,
} from '@angular/core';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';

export function reflectLocaleInDocument() {
  return provideEnvironmentInitializer(() => {
    const i18n = inject(I18n);

    effect(() => {
      const locale = i18n.locale();

      untracked(() => {
        document.documentElement.lang = locale.id;
      });
    });
  });
}
