import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'iso8601',
  standalone: true,
})
export class Iso8601 implements PipeTransform {
  transform(value: string | number | Date | Timestamp): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return new Date(value).toISOString();
    if (value instanceof Date) return value.toISOString();
    return value.toDate().toISOString();
  }
}
