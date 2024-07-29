import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { EditBlockLabel } from '@cv/cv/smart';
import { Section } from '@cv/cv/types';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';
import { BlockDirective } from './block.directive';
import { ParagraphEditor } from './paragraph';
import { SectionEditorActionMenu } from './section-action-menu';

@Component({
  selector: 'cv-edit--section',
  standalone: true,
  host: {
    class: 'cv-edit--section',
  },
  hostDirectives: [{ directive: BlockDirective, inputs: ['value'] }],
  imports: [
    ParagraphEditor,
    AddChildBlockButtonRibbon,
    EditBlockLabel,
    Translate,
    SectionEditorActionMenu,
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
