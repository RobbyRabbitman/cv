import { I18nDate } from './lib/date';
import { LocaleSelect } from './lib/locale-select';
import { Translate } from './lib/translate';

export * from './lib/date';
export * from './lib/locale-select';
export * from './lib/translate';

export const I18N_SMART = [Translate, LocaleSelect, I18nDate] as const;
