import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { EditBlockLabel } from '@cv/smart';
import { Section } from '@cv/types';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';
import { BlockDirective } from './block.directive';
import { ParagraphEditor } from './paragraph';

@Component({
  selector: 'cv--edit-section',
  standalone: true,
  hostDirectives: [{ directive: BlockDirective, inputs: ['block:value'] }],
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
  protected section = inject<BlockDirective<Section>>(BlockDirective);
}
