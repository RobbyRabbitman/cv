import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { Paragraph } from '@cv/types';
import { FieldEdit } from './field';

@Component({
  selector: 'cv--edit-paragraph',
  standalone: true,
  imports: [FieldEdit],
  templateUrl: './paragraph.html',
  styleUrl: './paragraph.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphEditor {
  paragraph = input.required<Paragraph>();
}
