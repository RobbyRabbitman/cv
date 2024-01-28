import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { Cv } from '@cv/types';
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
  cv = input.required<Cv>();
}
