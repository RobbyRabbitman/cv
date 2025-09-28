import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { Translate } from './ngx-translate-interop/translate';

@Injectable()
export class TranslatedTitle extends TitleStrategy {
  protected readonly title = inject(Title);
  protected readonly translate = inject(Translate);
  protected readonly value = signal<string | undefined>(undefined);

  protected readonly translateTitle = toObservable(this.value)
    .pipe(
      /**
       * TODO: provide default title? store app name somewhere, because its used
       * in multiple places e.g. in the logo aswell.
       */
      switchMap((title) =>
        title ? this.translate.stream(title) : of('EasyCV'),
      ),
      tap((title) => this.title.setTitle(title)),
      takeUntilDestroyed(),
    )
    .subscribe();

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.value.set(this.buildTitle(snapshot));
  }
}
