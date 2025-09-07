import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';

@Component({
  selector: 'cv-i18n--select-locale',
  imports: [MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatButton],
  template: `<button mat-button [mat-menu-trigger-for]="localesMenu">
      <mat-icon>translate</mat-icon>
      {{ i18n.locale().text }}
    </button>
    <mat-menu #localesMenu>
      @for (locale of i18n.localeEntities(); track locale) {
        <button
          mat-menu-item="locale"
          [attr.aria-current]="locale.id === i18n.locale().id"
          (click)="i18n.setLocale(locale.id)"
        >
          {{ locale.text }}
        </button>
      }
    </mat-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLocale {
  protected readonly i18n = inject(I18n);
}
