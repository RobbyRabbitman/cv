import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { EditBlockLabel } from '@cv/smart';
import { Section } from '@cv/types';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';
import { CvEditor } from './cv';
import { ParagraphEditor } from './paragraph';

@Component({
  selector: 'cv--edit-section',
  standalone: true,
  imports: [
    ParagraphEditor,
    AddChildBlockButtonRibbon,
    EditBlockLabel,
    Translate,
  ],
  viewProviders: [provideTranslatePrefix('CV.EDITOR.SECTION')],
  templateUrl: './section.html',
  styleUrl: './section.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEditor {
  section = input.required<Section>();

  protected store = inject(CvStore);

  protected editor = inject(CvEditor);

  protected paragraphPrototypes = computed(() =>
    this.store.getChildPrototypes(this.section())(),
  );
}
