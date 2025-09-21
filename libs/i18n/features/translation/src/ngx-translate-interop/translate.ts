import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Translate {
  private readonly ngxTranslate = inject(TranslateService);

  instant<T extends string | Record<string, unknown> = string>(
    ...args: Parameters<TranslateService['instant']>
  ) {
    return this.ngxTranslate.instant(...args) as T;
  }
}
