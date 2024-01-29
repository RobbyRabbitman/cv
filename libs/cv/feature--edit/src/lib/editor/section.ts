import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Section } from '@cv/types';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';
import { ParagraphEditor } from './paragraph';

@Component({
  selector: 'cv--edit-section',
  standalone: true,
  imports: [ParagraphEditor, AddChildBlockButtonRibbon],
  templateUrl: './section.html',
  styleUrl: './section.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEditor {
  section = input.required<Section>();

  store = inject(CvStore);

  protected paragraphPrototypes = computed(() =>
    this.store.getChildPrototypes(this.section())(),
  );
}
