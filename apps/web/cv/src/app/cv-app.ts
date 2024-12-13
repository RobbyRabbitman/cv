import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cv',
  template: `123<router-outlet />`,
  imports: [RouterOutlet],
  host: {
    class: 'flex',
  },
})
export class CvApp {}
