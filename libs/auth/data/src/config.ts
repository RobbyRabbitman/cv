import { makeEnvironmentProviders } from '@angular/core';
import { Auth } from './auth';
import { provideUserStore } from './user.store';

export function provideAuthData() {
  return makeEnvironmentProviders([provideUserStore(), Auth]);
}
