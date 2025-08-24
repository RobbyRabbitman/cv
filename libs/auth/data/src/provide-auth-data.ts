import type { Provider } from '@angular/core';
import { AuthApi } from './api/auth-api';
import { UserStore } from './store/user-store';

export function provideAuthData() {
  return [AuthApi, UserStore] satisfies Provider[];
}
