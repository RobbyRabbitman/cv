export type LocaleId = Intl.UnicodeBCP47LocaleIdentifier;

export interface Locale {
  /** A bcp47 string identifying the locale. */
  id: LocaleId;

  /**
   * The human-readable name of the locale in its own language (e.g., "Deutsch"
   * for German).
   */
  name: string;

  /** The id of the translation object associated with this locale. */
  translationId: string;
}
