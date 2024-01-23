import { RangeField } from './lib/blocks/range-field';
import { TextField } from './lib/blocks/text-field';

export * from './lib/blocks/range-field';
export * from './lib/blocks/text-field';

export const CV_UI = [TextField, RangeField] as const;
