import { CollectionReference, type DocumentData } from 'firebase/firestore';

export function typedCollection<T extends DocumentData>(
  collection: CollectionReference,
) {
  return collection.withConverter({
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snapshot): T {
      return snapshot.data() as T;
    },
  });
}
