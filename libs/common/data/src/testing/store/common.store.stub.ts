import { signal, type Provider } from '@angular/core';
import { CommonStore } from '@robby-rabbitman/cv-libs-common-data';
import {
  COLOR_SCHEMES,
  type ColorScheme,
} from '@robby-rabbitman/cv-libs-common-types';

export function provideCommonStoreStub() {
  return [
    CommonStoreStub,
    {
      provide: CommonStore,
      useExisting: CommonStoreStub,
    },
  ] satisfies Provider;
}

export class CommonStoreStub
  implements Partial<InstanceType<typeof CommonStore>>
{
  appName = signal('CV');

  colorScheme = signal<ColorScheme>('system');

  colorSchemes = signal(COLOR_SCHEMES);

  setColorScheme(colorScheme: ColorScheme) {
    this.colorScheme.set(colorScheme);
  }
}
