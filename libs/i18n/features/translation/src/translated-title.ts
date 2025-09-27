import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';
import { filter, switchMap, tap } from 'rxjs';
import { Translate } from './ngx-translate-interop/translate';

@Injectable()
export class TranslatedTitle extends TitleStrategy {
  protected readonly title = inject(Title);
  protected readonly translate = inject(Translate);
  protected readonly i18n = inject(I18n);
  protected readonly value = signal<string | undefined>(undefined);

  protected readonly translateTitle = toObservable(this.value)
    .pipe(
      filter(Boolean),
      switchMap((title) => this.translate.stream(title)),
      tap((title) => this.title.setTitle(title)),
      takeUntilDestroyed(),
    )
    .subscribe();

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.value.set(this.buildTitle(snapshot));
  }
}
