import { Pipe, type PipeTransform } from '@angular/core';
import { TranslatePipe as NgxTranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe extends NgxTranslatePipe implements PipeTransform {}
