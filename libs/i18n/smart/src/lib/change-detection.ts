import { ChangeDetectorRef, Injector, effect } from '@angular/core';
import { I18nStore } from '@cv/i18n/data';
import { assertInjector } from 'ngxtension/assert-injector';

export function markForCheckOnLocalization(injector?: Injector) {
  injector = assertInjector(markForCheckOnLocalization, injector);

  const store = injector.get(I18nStore);

  const cdr = injector.get(ChangeDetectorRef);

  effect(() => {
    if (store.localized()) cdr.markForCheck();
  });
}
