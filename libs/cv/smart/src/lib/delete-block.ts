import { Directive, computed, inject, input } from '@angular/core';
import { nativeElement } from '@cv/common/util';
import { CvStore } from '@cv/cv/data';
import { Block, Cv } from '@cv/cv/types';
import { I18nStore } from '@cv/i18n/data';
import { rxEffect } from 'ngxtension/rx-effect';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[cv-smart--delete-block]',
  standalone: true,
})
export class DeleteBlock {
  protected readonly i18n = inject(I18nStore);

  protected readonly element = nativeElement();

  protected readonly cvStore = inject(CvStore);

  constructor() {
    this.deleteOnClick();
  }

  readonly cv = input.required<Cv>();

  readonly block = input.required<Block>();

  protected deleteOnClick() {
    rxEffect(fromEvent(this.element, 'click'), () => this.delete());
  }

  delete() {
    this.cvStore.deleteBlock(this.block(), this.cv());
  }

  readonly translationPrefix = computed(() => 'CV.DELETE_BLOCK');

  readonly blockTranslationPrefix = computed(() =>
    this.i18n.translateBlockPrefix({
      blockOrPrototype: this.block(),
      cv: this.cv(),
    }),
  );
}
