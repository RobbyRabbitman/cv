import { createNoopInjectionToken } from 'ngxtension/create-injection-token';

export const [cvRoute, provideCvRoute] =
  createNoopInjectionToken<(cvId: string) => string>('[Cv] route');
