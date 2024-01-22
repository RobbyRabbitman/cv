import { SignInButton } from './sign-in/sign-in';
import { SignOutButton } from './sign-out/sign-out';

export * from './sign-in/sign-in';
export * from './sign-out/sign-out';

export const AUTH_SMART = [SignInButton, SignOutButton] as const;
