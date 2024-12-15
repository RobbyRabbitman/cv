import { Footer } from './footer/footer';
import { Header } from './header/header';
import { Shell } from './shell/shell';

export * from './footer/footer';
export * from './header/header';
export * from './shell/shell';

export const COMMON_SHELL_FEATURE = [Shell, Header, Footer] as const;
