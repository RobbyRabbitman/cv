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
  serverTimestamp,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  BlockPrototype,
  Cv,
  Paragraph,
  Section,
  TextField,
  UUID,
} from '@cv/common-types';
import { createBlock, uuid } from '@cv/common-util';

type InferCollectionModel<C> =
  C extends CollectionReference<DocumentData, infer T> ? keyof T : never;

type CvBlockPrototypesCollection = CollectionReference<
  { cvId: UUID; prototypeId: UUID },
  { cvId: UUID; prototypeId: UUID }
>;

type CvCollection = CollectionReference<Cv, Cv>;

type BlockPrototypesCollection = CollectionReference<
  BlockPrototype,
  BlockPrototype
>;

const cv_1_prototype: BlockPrototype<Cv> = {
  canBeDeleted: true,
  canBeMoved: true,
  id: 'cv_1_prototype',
  label: 'CV',
  multiple: true,
  type: 'cv',
  template: {
    childPrototypeIds: ['section_1_prototype'],
    createdAt: '',
    lastModifiedAt: '',
    userId: '',
  },
};

const section_1_prototype: BlockPrototype<Section> = {
  canBeDeleted: true,
  canBeMoved: true,
  id: 'section_1_prototype',
  label: 'section 1',
  multiple: true,
  type: 'section',
  template: {
    childPrototypeIds: ['paragraph_1_prototype'],
  },
};

const paragraph_1_prototype: BlockPrototype<Paragraph> = {
  canBeDeleted: true,
  canBeMoved: true,
  id: 'paragraph_1_prototype',
  label: 'paragraph 1',
  multiple: true,
  type: 'paragraph',
  template: {
    childPrototypeIds: ['field_1_prototype'],
  },
};

const field_1_prototype: BlockPrototype<TextField> = {
  canBeDeleted: true,
  canBeMoved: true,
  id: 'field_1_prototype',
  label: 'field 1',
  multiple: true,
  type: 'field',
  template: {
    value: 'field 1',
  },
};

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

    return snap.data();
  }

  async createCv(): Promise<UUID> {
    // TODO real impl
    const _cv = createBlock(cv_1_prototype, uuid, {
      section_1_prototype,
      paragraph_1_prototype,
      field_1_prototype,
    });

    const docRef = doc(this.cv);

    await setDoc(docRef, {
      ..._cv,
      userId: '',
      createdAt: serverTimestamp(),
      lastModifiedAt: serverTimestamp(),
    });

    return docRef.id;
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
