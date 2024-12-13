import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cv',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
export class CvApp {}
