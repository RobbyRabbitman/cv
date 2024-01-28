import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { Section } from '@cv/types';
import { ParagraphEditor } from './paragraph';

@Component({
  selector: 'cv--edit-section',
  standalone: true,
  imports: [ParagraphEditor],
  templateUrl: './section.html',
  styleUrl: './section.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEditor {
  section = input.required<Section>();
}
