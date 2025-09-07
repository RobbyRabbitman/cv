export type LocaleId = Intl.UnicodeBCP47LocaleIdentifier;

export interface Locale {
  id: LocaleId;
  text: string;
  translationId: string;
}
