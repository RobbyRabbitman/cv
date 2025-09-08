import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import {
  CollectionReference,
  DocumentReference,
  type DocumentData,
  type FirestoreDataConverter,
} from 'firebase/firestore';

export function applyDocId<T extends DocumentData>(
  doc: DocumentReference,
): DocumentReference<T & Identifiable, T>;
export function applyDocId<T extends DocumentData>(
  collection: CollectionReference,
): CollectionReference<T & Identifiable, T>;
export function applyDocId<T extends DocumentData>(
  collectionOrDoc: CollectionReference<T, T> | DocumentReference<T, T>,
) {
  const converter = {
    toFirestore(data) {
      data = structuredClone(data);
      delete data.id;
      return data;
    },
    fromFirestore(snapshot, options) {
      return Object.assign(snapshot.data(options), {
        id: snapshot.id,
      });
    },
  } as FirestoreDataConverter<T & Identifiable, T>;

  return collectionOrDoc instanceof CollectionReference
    ? collectionOrDoc.withConverter(converter)
    : collectionOrDoc.withConverter(converter);
}
