import { CreateCvButton } from './lib/create-cv-button';
import { CvCard } from './lib/cv-card';

export * from './lib/create-cv-button';
export * from './lib/cv-card';

export const CV_SMART = [CreateCvButton, CvCard] as const;
