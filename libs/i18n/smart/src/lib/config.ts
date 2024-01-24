import { makeEnvironmentProviders } from '@angular/core';
import { localizeDocument } from './document';

export function provideI18nSmart() {
  return makeEnvironmentProviders([localizeDocument()]);
}
