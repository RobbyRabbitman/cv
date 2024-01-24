import { ChangeDetectorRef, Injector, effect } from '@angular/core';
import { I18nStore } from '@cv/i18n/data';
import { assertInjector } from 'ngxtension/assert-injector';

export function markForCheckOnLocaleChanges(injector?: Injector) {
  injector = assertInjector(markForCheckOnLocaleChanges, injector);

  const store = injector.get(I18nStore);

  const cdr = injector.get(ChangeDetectorRef);

  effect(() => {
    if (!store.loading()) {
      cdr.markForCheck();
    }
  });
}
