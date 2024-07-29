import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CV_SMART } from '@cv/cv/smart';
import { Paragraph } from '@cv/cv/types';
import { BlockDirective } from './block.directive';
import { FieldEdit } from './field';

@Component({
  selector: 'cv-edit--paragraph',
  standalone: true,
  imports: [FieldEdit, CV_SMART],
  host: {
    class: 'cv-edit--paragraph',
  },
  hostDirectives: [{ directive: BlockDirective, inputs: ['value'] }],
  templateUrl: './paragraph.html',
  styleUrl: './paragraph.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphEditor {
  protected paragraph = inject<BlockDirective<Paragraph>>(BlockDirective);
}
