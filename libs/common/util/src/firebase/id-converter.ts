import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

export function idConverter<T extends DocumentData>(): FirestoreDataConverter<
  T & Identifiable,
  Omit<T, 'id'>
> {
  return {
    toFirestore(entity: T & Identifiable) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...doc } = entity;

      return doc;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<T>, options) {
      return {
        id: snapshot.id,
        ...snapshot.data(options),
      };
    },
  };
}
