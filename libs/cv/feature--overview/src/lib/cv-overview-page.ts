import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { CV_SMART } from '@cv/smart';

@Component({
  selector: 'cv-overview--page',
  standalone: true,
  imports: [CV_SMART],
  host: {
    class: 'cv-overview--page',
  },
  templateUrl: './cv-overview-page.html',
  styleUrl: './cv-overview-page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CvOverviewPage {
  protected cv = inject(CvStore);
}
