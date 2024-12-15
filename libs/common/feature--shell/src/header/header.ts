import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'cv-common--feature-shell--header',
  imports: [MatToolbar],
  host: { class: 'cv-common--feature-shell--header', role: 'banner' },
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
