import { CreateCvButton } from './lib/create-cv-button';
import { CvActionMenu } from './lib/cv-action-menu';
import { CvCard } from './lib/cv-card';
import { DeleteBlock } from './lib/delete-block';
import { DeleteBlockButton } from './lib/delete-block-button';
import { EditBlockLabel } from './lib/edit-block-label';

export * from './lib/create-cv-button';
export * from './lib/cv-action-menu';
export * from './lib/cv-card';
export * from './lib/delete-block';
export * from './lib/delete-block-button';
export * from './lib/edit-block-label';

export const CV_SMART = [
  CreateCvButton,
  CvActionMenu,
  CvCard,
  DeleteBlockButton,
  DeleteBlock,
  EditBlockLabel,
] as const;
