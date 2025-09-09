import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';

export type InferDbModelType<X> =
  X extends CollectionReference<DocumentData, infer T>
    ? keyof T
    : X extends DocumentReference<DocumentData, infer T>
      ? keyof T
      : never;
