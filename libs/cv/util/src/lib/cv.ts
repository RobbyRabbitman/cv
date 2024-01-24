import {} from '@angular/core'; // TODO pnpm ts issue? https://github.com/microsoft/TypeScript/issues/42873#issuecomment-1497551116
import { createNoopInjectionToken } from 'ngxtension/create-injection-token';

export const [cvRoute, provideCvRoute] =
  createNoopInjectionToken<(cvId: string) => string>('[Cv] route');
