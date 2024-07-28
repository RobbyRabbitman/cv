import { Injectable, inject } from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Identifiable, UUID } from '@cv/common/types';
import { firestore } from '@cv/common/util';
import { Translation } from '@cv/i18n/types';
import { Block, BlockPrototype, Cv, CvTemplate } from '@cv/types';
import { createCv } from '@cv/util';
import {
  CollectionReference,
  DocumentData,
  collection,
  deleteDoc,
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

type CvCollection = CollectionReference<Cv, Cv>;

type CvTemplateCollection = CollectionReference<CvTemplate, CvTemplate>;

type BlockPrototypeCollection = CollectionReference<
  BlockPrototype,
  BlockPrototype
>;

@Injectable()
export class Api {
  protected firestore = firestore();

  protected user = inject(UserStore);

  protected readonly i18nCollection = collection(
    this.firestore,
    'i18n',
  ) as unknown as CollectionReference<Translation, Translation>;

  protected cvCollection = collection(
    this.firestore,
    'cv',
  ) as unknown as CvCollection;

  protected cvTemplateCollection = collection(
    this.firestore,
    'cvTemplate',
  ) as unknown as CvTemplateCollection;

  protected blockPrototypeCollection = collection(
    this.firestore,
    'blockPrototype',
  ) as unknown as BlockPrototypeCollection;

  async getCvTemplate(cvTemplateId: UUID): Promise<CvTemplate> {
    const cvTemplate = await getDoc(
      doc(this.cvTemplateCollection, cvTemplateId),
    );

    if (!cvTemplate.exists())
      throw new Error(`[Api]: no cv template found for id '${cvTemplateId}'.`);

    return cvTemplate.data();
  }

  async getAllCvTemplates(): Promise<CvTemplate[]> {
    return (await getDocs(this.cvTemplateCollection)).docs.map((snap) =>
      snap.data(),
    );
  }

  async getCv(cvId: UUID): Promise<Cv> {
    const cv = await getDoc(doc(this.cvCollection, cvId));

    if (!cv.exists()) throw new Error(`[Api]: no cv found for id '${cvId}'.`);

    return cv.data();
  }

  async deleteCv(cvId: UUID): Promise<void> {
    return deleteDoc(doc(this.cvCollection, cvId));
  }

  async getAllCvs(): Promise<Cv[]> {
    return (
      await getDocs(
        query(
          this.cvCollection,
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
    const cvRef = doc(this.cvCollection, cv.id);

    await updateDoc(cvRef, { ...cv, lastModifiedAt: Date.now() });
  }

  async createCv(cvTemplateId: UUID, cvId: UUID): Promise<Cv> {
    const userId = this.userId();

    const prototypes = (await this.getPrototypes(cvTemplateId)).reduce(
      (map, prototype) => {
        map[prototype.id] = prototype;
        return map;
      },
      {} as Record<UUID, BlockPrototype<Block>>,
    );

    const cvDoc = doc(this.cvCollection, cvId);

    const cv = {
      ...createCv(prototypes),
      id: cvId,
      userId,
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    } satisfies Cv;

    await setDoc(cvDoc, cv);

    return cv;
  }

  async getPrototypes(cvTemplateId: UUID): Promise<BlockPrototype<Block>[]> {
    const prototypes = (
      await getDocs(
        query(
          this.blockPrototypeCollection,
          where(
            'templateId' satisfies InferCollectionModel<BlockPrototypeCollection>,
            '==',
            cvTemplateId,
          ),
        ),
      )
    ).docs.map((snap) => snap.data());

    return prototypes;
  }

  async getOneWithPrototypes(
    cvId: UUID,
  ): Promise<{ cv: Cv; prototypes: BlockPrototype[] }> {
    const cv = await this.getCv(cvId);

    const prototypes = await this.getPrototypes(cv.templateId);

    return { cv, prototypes };
  }

  async getTranslation(id: UUID, locale: string): Promise<Translation> {
    const translation = await getDoc(
      doc(this.firestore, this.i18nCollection.path, locale, 'translation', id),
    );

    if (!translation.exists())
      throw new Error(
        `[Api]: no translation found id '${id}'. Provided '${locale}'.`,
      );

    return translation.data();
  }

  /**
   *
   * @returns all available locales
   */
  async getAllLocales(): Promise<UUID[]> {
    return (await getDocs(this.i18nCollection)).docs.map(({ id }) => id);
  }

  /**
   *
   * @returns the id of the signed in user, throws if user is not signed in,
   */
  protected userId() {
    const user = this.user.value();

    if (!user) throw new Error(`[Api]: no user.`);

    return user.uid;
  }
}
