import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'cv-common--feature-shell--shell',
  imports: [Header, Footer, MatSidenav, MatSidenavContainer, MatSidenavContent],
  host: {
    class: 'cv-common--feature-shell--shell flex flex-col min-h-full',
  },
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {}
