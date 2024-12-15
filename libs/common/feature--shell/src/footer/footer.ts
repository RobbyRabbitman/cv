import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'cv-common--feature-shell--footer',
  imports: [MatToolbar],
  host: { class: 'cv-common--feature-shell--footer', role: 'contentinfo' },
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
