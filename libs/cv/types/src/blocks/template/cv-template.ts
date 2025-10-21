import type { Identifiable } from '@robby-rabbitman/cv-libs-common-types';
import type { Labeled } from '../modifier/labeled';

/**
 * TODO: maybe change the reference direction and have the template reference a
 * set of block prototypes, so that they are resuable.
 */
export interface CvTemplate extends Identifiable, Labeled {}
