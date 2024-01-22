import {
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  effect,
  inject,
} from '@angular/core';
import { I18nStore } from '@cv/i18n-data';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class Translate implements PipeTransform {
  protected store = inject(I18nStore);

  protected cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      if (!this.store.loading()) {
        this.cdr.markForCheck();
      }
    });
  }

  transform = this.store.translateInstant;
}
