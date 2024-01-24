import { Injectable, inject } from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Identifiable, UUID } from '@cv/common/types';
import { firestore, uuid } from '@cv/common/util';
import { BlockPrototype, Cv, Paragraph, Section, TextField } from '@cv/types';
import { createBlock } from '@cv/util';
import {
  CollectionReference,
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

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
    createdAt: 0,
    lastModifiedAt: 0,
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
  protected firestore = firestore();

  protected user = inject(UserStore);

  // collection names
  protected CV = 'cv';

  protected BLOCK_PROTOTYPES = 'blockPrototypes';

  protected CV_BLOCK_PROTOTYPES = 'cvBlockPrototypes';

  // collections
  protected cv = collection(this.firestore, this.CV) as unknown as CvCollection;

  protected blockPrototypes = collection(
    this.firestore,
    this.BLOCK_PROTOTYPES,
  ) as unknown as BlockPrototypesCollection;

  protected cvBlockPrototypes = collection(
    this.firestore,
    this.CV_BLOCK_PROTOTYPES,
  ) as unknown as CvBlockPrototypesCollection;

  async getOne(cvId: UUID): Promise<Cv> {
    const ref = doc(this.cv, cvId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error(`[Api]: no cv found for id '${cvId}'.`);

    return snap.data();
  }

  async getAll(): Promise<Cv[]> {
    return (
      await getDocs(
        query(
          this.cv,
          where(
            'userId' satisfies InferCollectionModel<CvCollection>,
            '==',
            this.userId(),
          ),
        ),
      )
    ).docs.map((snap) => snap.data());
  }

  async update(cv: Partial<Cv> & Identifiable): Promise<void> {
    const cvRef = doc(this.cv, cv.id);

    await updateDoc(cvRef, { ...cv, lastModifiedAt: Date.now() });
  }

  async create(): Promise<UUID> {
    const userId = this.userId();

    // TODO real impl
    const _cv = createBlock(cv_1_prototype, uuid, {
      section_1_prototype,
      paragraph_1_prototype,
      field_1_prototype,
    });

    const cvRef = doc(this.cv);

    await setDoc(cvRef, {
      ..._cv,
      id: cvRef.id,
      userId,
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    });

    return cvRef.id;
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

  async getOneWithPrototypes(
    cvId: UUID,
  ): Promise<{ cv: Cv; prototypes: BlockPrototype[] }> {
    const cv = await this.getOne(cvId);

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

  protected userId() {
    const user = this.user.value();

    if (!user) throw new Error(`[Api]: no user.`);

    return user.uid;
  }
}
