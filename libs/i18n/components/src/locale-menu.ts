import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-features-translation';

@Component({
  selector: 'cv-i18n--locale-menu',
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatButton,
    TranslatePipe,
  ],
  host: {
    'data-testid': 'locale-menu',
  },
  template: `<button
      mat-button
      [mat-menu-trigger-for]="localeMenu"
      [aria-label]="'i18n.locale_menu.trigger.text' | translate"
    >
      <mat-icon>translate</mat-icon>
      {{ i18n.locale().name }}
    </button>
    <mat-menu #localeMenu hasBackdrop="false">
      @for (locale of i18n.locales(); track locale.id) {
        <button
          mat-menu-item
          [attr.aria-current]="locale.active || null"
          [attr.data-testid]="'locale-menu-item-' + locale.id"
          (click)="i18n.setLocale(locale.id)"
        >
          {{ locale.name }}
        </button>
      }
    </mat-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleMenu {
  protected readonly i18n = inject(I18n);
}
