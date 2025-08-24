import { inject, Injectable } from '@angular/core';
import type { Identifiable, UUID } from '@robby-rabbitman/cv-libs-common-types';
import { FIRESTORE } from '@robby-rabbitman/cv-libs-common-util';
import type {
  Block,
  BlockPrototype,
  Cv,
  CvTemplate,
} from '@robby-rabbitman/cv-libs-cv-types';
import { createCv } from '@robby-rabbitman/cv-libs-cv-util';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

@Injectable()
export class CvApi {
  protected readonly firestore = inject(FIRESTORE);

  protected readonly collections = {
    cv: collection(this.firestore, 'cv') as CvCollection,
    template: collection(this.firestore, 'cvTemplate') as CvTemplateCollection,
    blockPrototype: collection(
      this.firestore,
      'blockPrototype',
    ) as BlockPrototypeCollection,
  };

  async getCvTemplate(cvTemplateId: UUID): Promise<CvTemplate> {
    const cvTemplate = await getDoc(
      doc(this.collections.template, cvTemplateId),
    );

    if (!cvTemplate.exists())
      throw new Error(
        `[CvApi]: no cv template found for id '${cvTemplateId}'.`,
      );

    return cvTemplate.data();
  }

  async getAllCvTemplates(): Promise<CvTemplate[]> {
    return (await getDocs(this.collections.template)).docs.map((snap) =>
      snap.data(),
    );
  }

  async getCv(cvId: UUID): Promise<Cv> {
    const cv = await getDoc(doc(this.collections.cv, cvId));

    if (!cv.exists()) throw new Error(`[CvApi]: no cv found for id '${cvId}'.`);

    return cv.data();
  }

  async deleteCv(cvId: UUID): Promise<void> {
    return deleteDoc(doc(this.collections.cv, cvId));
  }

  async getAllCvs(): Promise<Cv[]> {
    return (
      await getDocs(
        query(
          this.collections.cv,
          where(
            'userId' satisfies InferCollectionModel<CvCollection>,
            '==',
            this.userId(),
          ),
        ),
      )
    ).docs.map((snap) => snap.data());
  }

  async updateCv(cv: Partial<Cv> & Identifiable): Promise<void> {
    const cvRef = doc(this.collections.cv, cv.id);

    await updateDoc(cvRef, { ...cv, lastModifiedAt: Date.now() });
  }

  async createCv(cvTemplateId: UUID, cvId: UUID): Promise<Cv> {
    const userId = this.userId();

    const blockPrototypes =
      await this.getBlockPrototypesOfCvTemplate(cvTemplateId);

    const cvDoc = doc(this.collections.cv, cvId);

    const cv = {
      ...createCv(blockPrototypes),
      id: cvId,
      userId,
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    } satisfies Cv;

    await setDoc(cvDoc, cv);

    return cv;
  }

  async getBlockPrototypesOfCvTemplate(
    cvTemplateId: UUID,
  ): Promise<Record<UUID, BlockPrototype<Block>>> {
    const blockPrototypes = (
      await getDocs(
        query(
          this.collections.blockPrototype,
          where(
            'cvTemplateId' satisfies InferCollectionModel<BlockPrototypeCollection>,
            '==',
            cvTemplateId,
          ),
        ),
      )
    ).docs
      .map((snap) => snap.data())
      .reduce(
        (map, prototype) => {
          map[prototype.id] = prototype;
          return map;
        },
        {} as Record<UUID, BlockPrototype<Block>>,
      );

    return blockPrototypes;
  }

  async getCvWithItsBlockPrototypes(
    cvId: UUID,
  ): Promise<{ cv: Cv; blockPrototypes: Record<UUID, BlockPrototype<Block>> }> {
    const cv = await this.getCv(cvId);

    const blockPrototypes = await this.getBlockPrototypesOfCvTemplate('todo');

    return { cv, blockPrototypes };
  }

  /** @returns The id of the signed in user, throws if user is not signed in, */
  protected userId() {
    return 'TODO';

    // const user = this.user.value();

    // if (!user) throw new Error(`[CvApi]: no user.`);

    // return user.uid;
  }
}

type InferCollectionModel<C> =
  C extends CollectionReference<DocumentData, infer T> ? keyof T : never;

type CvCollection = CollectionReference<Cv, Cv>;

type CvTemplateCollection = CollectionReference<CvTemplate, CvTemplate>;

type BlockPrototypeCollection = CollectionReference<
  BlockPrototype,
  BlockPrototype
>;
