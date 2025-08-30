import type { Provider } from '@angular/core';
import { AuthApi } from '@robby-rabbitman/cv-libs-auth-data';
import { AuthApiStub } from './auth-api-stub';

export function provideAuthApiTesting() {
  return [
    {
      provide: AuthApi,
      useClass: AuthApiStub,
    },
  ] satisfies Provider[];
}
