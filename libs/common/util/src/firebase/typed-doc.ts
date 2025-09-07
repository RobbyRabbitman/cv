import { type Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import { DocumentReference, type DocumentData } from 'firebase/firestore';

export function typedDoc<T extends DocumentData>(doc: DocumentReference) {
  return doc.withConverter({
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
