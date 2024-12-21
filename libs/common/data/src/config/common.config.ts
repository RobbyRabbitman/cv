import {
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
  type Provider,
} from '@angular/core';
import {
  setColorScheme,
  type ColorSchemeOptions,
} from '@robby-rabbitman/cv-libs-common-util';
import { CommonStore } from '../store/common.store';

export function provideCommonData(...features: CommonDataFeature[]) {
  return makeEnvironmentProviders(features.map((feature) => feature.providers));
}

export type CommonDataFeatureKind = 'color-scheme' | 'store';

export interface CommonDataFeature {
  kind: CommonDataFeatureKind;
  providers: (Provider | EnvironmentProviders)[];
}

export function makeCommonDataFeature(
  kind: CommonDataFeatureKind,
  providers: (Provider | EnvironmentProviders)[],
) {
  return { kind, providers } satisfies CommonDataFeature;
}

/** Sets the color scheme based on the state of the common store. */
export function withColorScheme(
  options?: Pick<ColorSchemeOptions, 'targetElement'>,
) {
  return makeCommonDataFeature('color-scheme', [
    provideEnvironmentInitializer(() => {
      const commonStore = inject(CommonStore);
      setColorScheme({
        colorScheme: commonStore.colorScheme,
        targetElement: options?.targetElement,
      });
    }),
  ]);
}

/** Provides the {@link CommonStore}. */
export function withCommonStore() {
  return makeCommonDataFeature('store', [CommonStore]);
}
