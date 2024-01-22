import { RangeFieldComponent } from './lib/blocks/range-field';
import { TextFieldComponent } from './lib/blocks/text-field';

export * from './lib/blocks/range-field';
export * from './lib/blocks/text-field';

export const COMMON_UI = [TextFieldComponent, RangeFieldComponent] as const;
