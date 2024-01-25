export const ENTITY_STATUS = [
  'unknown',
  'loading',
  'success',
  'error',
] as const;

export type EntityStatus = (typeof ENTITY_STATUS)[number];
