import { Component } from '@angular/core';
import { RangeField, TextField } from '@cv/common-types';
import { COMMON_UI } from '@cv/common-ui';

@Component({
  standalone: true,
  imports: [COMMON_UI],
  selector: 'cv-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  textField: TextField = {
    value: 'foo',
    type: 'field',
    id: 'foo id',
    prototypeId: 'foo proto id',
  };

  rangeField: RangeField = {
    value: 0,
    min: 0,
    max: 10,
    type: 'field',
    id: 'range id',
    prototypeId: 'range proto id',
  };
}
