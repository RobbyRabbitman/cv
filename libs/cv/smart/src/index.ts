import { CreateCvButton } from './lib/create-cv-button';
import { CvCard } from './lib/cv-card';
import { EditBlockLabel } from './lib/edit-block-label';

export * from './lib/create-cv-button';
export * from './lib/cv-card';
export * from './lib/edit-block-label';

export const CV_SMART = [CreateCvButton, CvCard, EditBlockLabel] as const;
