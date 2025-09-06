import { signalStore, withState } from '@ngrx/signals';

interface I18nState {
  locale: Intl.UnicodeBCP47LocaleIdentifier;
}

export const I18n = signalStore(withState<I18nState>({ locale: 'en' }));
