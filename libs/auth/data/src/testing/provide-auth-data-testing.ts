import type { Provider } from '@angular/core';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { provideAuthApiTesting } from './api/provide-auth-api-testing';

export function provideAuthDataTesting() {
  return [...provideAuthApiTesting(), UserStore] satisfies Provider[];
}
