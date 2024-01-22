import { SignInButton } from './lib/sign-in/sign-in';
import { SignOutButton } from './lib/sign-out/sign-out';

export * from './lib/sign-in/sign-in';
export * from './lib/sign-out/sign-out';

export const AUTH_SMART = [SignInButton, SignOutButton] as const;
