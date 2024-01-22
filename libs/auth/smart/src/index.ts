import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';

export * from './signin/signin.component';
export * from './signout/signout.component';

export const AUTH_SMART = [SigninComponent, SignoutComponent] as const;
