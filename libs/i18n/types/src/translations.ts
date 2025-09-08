import type { LocaleId } from './locale';

/** Translations of a certain locale. */
export interface Translations {
  localeId: LocaleId;
  value: Record<string, unknown>;
}
