import { makeEnvironmentProviders } from '@angular/core';
import { localizeDocument, localizeTitle } from './document';

export function provideI18nSmart() {
  return makeEnvironmentProviders([localizeDocument(), localizeTitle()]);
}
