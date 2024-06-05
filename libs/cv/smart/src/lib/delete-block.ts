import { Directive, inject, input } from '@angular/core';
import { nativeElement } from '@cv/common/util';
import { CvStore } from '@cv/data';
import { Block, Cv } from '@cv/types';
import { rxEffect } from 'ngxtension/rx-effect';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[cv-smart--delete-block]',
  standalone: true,
})
export class DeleteBlock {
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
}
