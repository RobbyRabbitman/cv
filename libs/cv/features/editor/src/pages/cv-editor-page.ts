import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { injectRouteParameter } from '@robby-rabbitman/cv-libs-common-util';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-translation';
import { CvEditor } from '../components/cv-editor';
import { CV_EDITOR_ROUTE_PARAMETERS } from './cv-editor-routes';

@Component({
  selector: 'cv--editor--page',
  imports: [TranslatePipe, CvEditor],
  host: { class: 'flex flex-col py-8 gap-8' },
  template: `<h1 class="sr-only">{{ 'cv.editor.page.title' | translate }}</h1>
    @if (cv(); as cv) {
      <cv--editor [cv]="cv" />
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CvEditorPage {
  protected readonly cvStore = inject(CvStore);

  protected readonly cvId = injectRouteParameter(
    CV_EDITOR_ROUTE_PARAMETERS.cvId,
  );

  protected readonly cv = computed(() => {
    const cvId = this.cvId();

    if (!cvId) {
      return undefined;
    }

    return this.cvStore.allMap()[cvId];
  });
}
