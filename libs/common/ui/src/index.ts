import { RangeFieldComponent } from './blocks/range-field';
import { TextFieldComponent } from './blocks/text-field';

export * from './blocks/range-field';
export * from './blocks/text-field';

export const COMMON_UI = [TextFieldComponent, RangeFieldComponent] as const;
