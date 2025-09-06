import { DocumentReference, type DocumentData } from 'firebase/firestore';

export function typedDoc<T extends DocumentData>(doc: DocumentReference) {
  return doc.withConverter({
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snapshot): T {
      return snapshot.data() as T;
    },
  });
}
