import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import type { Cv } from '@robby-rabbitman/cv-libs-cv-types';
import { CvEditorBlockRenderer } from '../cv-editor-block-renderer';
import { EditorBlock } from './editor-block';

@Component({
  selector: 'cv--editor--cv-block',
  imports: [
    forwardRef(() => CvEditorBlockRenderer),
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
  ],
  template: `<mat-accordion>
    @for (block of block().children; track block.id) {
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>{{ block.label }}</mat-panel-title>
          <mat-panel-description>
            {{ block.type }} - {{ block.id }}
          </mat-panel-description>
        </mat-expansion-panel-header>
        <ng-template [cv--editor--block]="block" />
      </mat-expansion-panel>
    }
  </mat-accordion> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorCvBlock extends EditorBlock<Cv> {}
