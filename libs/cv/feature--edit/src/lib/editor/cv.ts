import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Blocks, Cv } from '@cv/types';
import { SectionEditor } from './section';

@Component({
  selector: 'cv--edit-cv',
  standalone: true,
  imports: [SectionEditor],
  templateUrl: './cv.html',
  styleUrl: './cv.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvEditor {
  store = inject(CvStore);

  cv = input.required<Cv>();

  patch<TBlock extends Blocks>(block: TBlock) {
    this.store.patchBlock(this.cv(), block);
  }
}
