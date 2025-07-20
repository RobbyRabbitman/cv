import type { Block } from './block';

/** A field in a paragraph. */
export type Field = Block;

/** A field. It has a value of type `T`. */
export interface SimpleField<TValue> extends Field {
  /** The value of this field */
  value: TValue;
}

/** A field which is a _composition_ of multiple fields. */
export interface CompositeField<TFields extends readonly Field[] = Field[]>
  extends Field {
  type: 'composite';

  /** The fields this is composed of. */
  children: TFields;
}

/** A field which has a text `value`. */
export interface TextField extends SimpleField<string> {
  type: 'text';
}

/** A field which has a `value` in an integer range between `min` and `max` */
export interface RangeField extends SimpleField<number> {
  /** Lower bound of this range. */
  min: number;

  /** Upper bound of this range. */
  max: number;
}

/** A date range field. A date is represented by a iso 8601 string. */
export interface DateRangeField extends CompositeField<[TextField, TextField]> {
  /** Whether the range end _is_ present. */
  present: boolean;
}
