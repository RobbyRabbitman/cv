export const COLOR_SCHEMES = ['light', 'dark', 'system'] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];
