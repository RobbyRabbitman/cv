import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { CvStore } from '@cv/data';
import { injectParams } from 'ngxtension/inject-params';
import { CvEditor } from './editor/cv';

@Component({
  selector: 'cv--edit-page',
  standalone: true,
  imports: [CvEditor],
  templateUrl: './cv-edit-page.html',
  styleUrl: './cv-edit-page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CvEditPage {
  protected cvStore = inject(CvStore);

  protected router = inject(Router);

  constructor() {
    this.handleEmptyParam();
    this.handleError();
  }

  cvId = injectParams('cvId');

  cv = computed(() => {
    const cvId = this.cvId();

    if (!cvId) return;

    untracked(() => this.cvStore.getOne(cvId));

    return this.cvStore.cvEntityMap()[cvId];
  });

  // check that the prototypes exist
  prototypes = this.cvStore.prototypeEntityMap;

  protected handleEmptyParam() {
    if (!this.cvId()) this.router.navigateByUrl('/');
  }

  protected handleError() {
    effect(() => {
      const cvId = this.cvId();

      if (!cvId) return;

      const status = this.cvStore.status(cvId)();

      if (status === 'error') this.router.navigateByUrl('/');
    });
  }
}
