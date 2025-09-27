import { inject, Injectable, Injector, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { merge, type Observable } from 'rxjs';

@Injectable()
export class Translate {
  private readonly ngxTranslate = inject(TranslateService);

  instant<T extends string | Record<string, unknown> = string>(
    key: string,
    options?: {
      interpolateParams?: Record<string, unknown>;
    },
  ) {
    return this.ngxTranslate.instant(key, options?.interpolateParams) as T;
  }

  get<T extends string | Record<string, unknown> = string>(
    key: string,
    options?: {
      interpolateParams?: Record<string, unknown>;
      injector?: Injector;
    },
  ) {
    return toSignal(this.stream<T>(key, options), {
      initialValue: this.instant<T>(key, options),
      injector: options?.injector,
    }) as Signal<T>;
  }

  stream<T extends string | Record<string, unknown> = string>(
    key: string,
    options?: {
      interpolateParams?: Record<string, unknown>;
    },
  ) {
    return merge(
      this.ngxTranslate.stream(key, options?.interpolateParams),
      this.ngxTranslate.getStreamOnTranslationChange(
        key,
        options?.interpolateParams,
      ),
    ) as Observable<T>;
  }
}
