import {
  effect,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  DefaultTitleStrategy,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { CommonStore } from '@cv/common/data';
import { injectWindow, runOnEnvironmentInit } from '@cv/common/util';
import { I18nStore } from '@cv/i18n/data';

export const localizeDocument = () =>
  runOnEnvironmentInit(() => {
    const i18n = inject(I18nStore);
    const window = injectWindow();
    effect(() => (window.document.documentElement.lang = i18n.locale()));
  });

export const localizeTitle = () =>
  makeEnvironmentProviders([
    {
      provide: TitleStrategy,
      useFactory: () => {
        const i18n = inject(I18nStore);
        const common = inject(CommonStore);
        const title = inject(Title);
        const defaultTitleStrategy = inject(DefaultTitleStrategy);
        const title$ = signal(common.appName());

        effect(() => title.setTitle(i18n.translate(title$())()));

        return {
          updateTitle(snapshot: RouterStateSnapshot): void {
            title$.set(
              defaultTitleStrategy.buildTitle(snapshot) ?? common.appName(),
            );
          },
        } satisfies Pick<TitleStrategy, 'updateTitle'>;
      },
    },
  ]);
