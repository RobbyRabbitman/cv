import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import {
  CollectionReference,
  DocumentReference,
  type DocumentData,
} from 'firebase/firestore';

export function applyDocId<T extends DocumentData>(
  collectionOrDoc: CollectionReference | DocumentReference,
) {
  /**
   * TODO: Seems like a type issue (?) - both CollectionReference and
   * DocumentReference can be extended with the exact same converter below
   */
  return (collectionOrDoc as CollectionReference).withConverter({
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
