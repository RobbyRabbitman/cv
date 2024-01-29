import { SignInButton } from './lib/sign-in';
import { SignOutButton } from './lib/sign-out';

export * from './lib/auth.guard';
export * from './lib/sign-in';
export * from './lib/sign-out';

export const AUTH_SMART = [SignInButton, SignOutButton] as const;
