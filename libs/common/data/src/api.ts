import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { BlockPrototype, Cv, UUID } from '@cv/common-types';

type InferCollectionModel<C> =
  C extends CollectionReference<DocumentData, infer T> ? keyof T : never;

type CvBlockPrototypesCollection = CollectionReference<
  { cvId: UUID; prototypeId: UUID },
  { cvId: UUID; prototypeId: UUID }
>;

type CvCollection = CollectionReference<
  Omit<Cv, 'createdAt' | 'lastModifiedAt'>,
  Cv
>;

type BlockPrototypesCollection = CollectionReference<
  BlockPrototype,
  BlockPrototype
>;

@Injectable()
export class Api {
  CV = 'cv';
  BLOCK_PROTOTYPES = 'blockPrototypes';
  CV_BLOCK_PROTOTYPES = 'cvBlockPrototypes';

  firestore = inject(Firestore);

  cv = collection(this.firestore, this.CV) as unknown as CvCollection;

  blockPrototypes = collection(
    this.firestore,
    this.BLOCK_PROTOTYPES,
  ) as unknown as BlockPrototypesCollection;

  cvBlockPrototypes = collection(
    this.firestore,
    this.CV_BLOCK_PROTOTYPES,
  ) as unknown as CvBlockPrototypesCollection;

  async getCv(cvId: UUID): Promise<Cv> {
    const ref = doc(this.cv, cvId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error(`[Api]: no cv found for id '${cvId}'.`);

    return {
      ...snap.data(),
      createdAt: '',
      lastModifiedAt: '',
    };
  }

  async getPrototypeUuids(cvId: UUID): Promise<UUID[]> {
    return (
      await getDocs(
        query(
          this.cvBlockPrototypes,
          where(
            'cvId' satisfies InferCollectionModel<CvBlockPrototypesCollection>,
            '==',
            cvId,
          ),
        ),
      )
    ).docs.map((snap) => snap.data().prototypeId);
  }

  async getCvWithBlockPrototypes(
    cvId: UUID,
  ): Promise<{ cv: Cv; prototypes: BlockPrototype[] }> {
    const cv = await this.getCv(cvId);

    const prototypeIds = await this.getPrototypeUuids(cvId);

    const prototypes = (
      await getDocs(
        query(
          this.blockPrototypes,
          where(
            'id' satisfies InferCollectionModel<BlockPrototypesCollection>,
            'in',
            prototypeIds,
          ),
        ),
      )
    ).docs.map((snap) => snap.data());

    return { cv, prototypes };
  }
}
