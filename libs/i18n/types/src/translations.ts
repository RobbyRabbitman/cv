import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import type { LocaleId } from './locale';

/** Translations of a certain locale. */
export interface Translations extends Identifiable {
  localeId: LocaleId;
  value: Record<string, unknown>;
}
