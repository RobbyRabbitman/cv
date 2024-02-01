import { Directive, inject, input } from '@angular/core';
import { fromEvent, injectElement } from '@cv/common/util';
import { CvStore } from '@cv/data';
import { Block, Cv } from '@cv/types';
import { rxEffect } from 'ngxtension/rx-effect';

@Directive({
  selector: '[cv-smart--delete-block]',
  standalone: true,
})
export class DeleteBlockDirective {
  protected element = injectElement();

  protected cvStore = inject(CvStore);

  constructor() {
    rxEffect(fromEvent(this.element, 'click'), () =>
      this.cvStore.deleteBlock(this.block(), this.cv()),
    );
  }

  cv = input.required<Cv>();

  block = input.required<Block>();
}
