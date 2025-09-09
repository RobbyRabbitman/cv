import { InjectionToken, type Provider } from '@angular/core';

export const FEATURE_BASE_PATH = new InjectionToken<string>(
  'FEATURE_BASE_PATH',
);

export function provideFeatureBasePath(path: string) {
  return [
    {
      provide: FEATURE_BASE_PATH,
      useValue: path,
    },
  ] satisfies Provider[];
}
