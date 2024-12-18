import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { SelectColorScheme } from '@robby-rabbitman/cv-libs-common-feature--color-scheme';

@Component({
  selector: 'cv-common--feature-shell--header',
  imports: [MatToolbar, SelectColorScheme],
  host: { class: 'cv-common--feature-shell--header', role: 'banner' },
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
