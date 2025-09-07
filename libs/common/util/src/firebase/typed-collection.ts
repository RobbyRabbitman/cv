import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import { CollectionReference, type DocumentData } from 'firebase/firestore';

export function typedCollection<T extends DocumentData>(
  collection: CollectionReference,
) {
  return collection.withConverter({
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snapshot): T & Identifiable {
      return Object.assign(snapshot.data(), {
        id: snapshot.id,
      }) as T & Identifiable;
    },
  });
}
