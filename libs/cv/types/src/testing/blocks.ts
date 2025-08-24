import type {
  BlockPrototype,
  Cv,
  CvBlockTemplate,
  CvTemplate,
  Paragraph,
  TextField,
} from '@robby-rabbitman/cv-libs-cv-types';

const cvTemplate = {
  id: 'cvTemplate',
  label: 'cv.template.cvTemplate.label',
} as const satisfies CvTemplate;

const cvPrototype = {
  id: 'cvPrototype',
  type: 'cv',
  canBeDeleted: true,
  canBeMoved: false,
  multiple: false,
  cvTemplateId: cvTemplate.id,
  label: 'block.prototype.cvPrototype.label',
  template: {
    childPrototypeIds: [],
  },
} as const satisfies BlockPrototype<Cv, CvBlockTemplate>;

const cv = {
  type: 'cv',
  /** 2025-04-15 */
  createdAt: 1744668000000,
  /** 2025-04-16 */
  lastModifiedAt: 1744754400000,
  id: 'cv',
  children: [],
  userId: 'user1',
  label: 'cv - user1',
  prototypeId: cvPrototype.id,
} as const satisfies Cv;

const textFieldPrototype = {
  id: 'textFieldPrototype',
  type: 'text',
  canBeDeleted: true,
  canBeMoved: true,
  multiple: true,
  cvTemplateId: cvTemplate.id,
  label: 'block.prototype.textFieldPrototype.label',
  template: {
    value: 'Text Field',
  },
} as const satisfies BlockPrototype<TextField>;

const textField = {
  id: 'textField',
  type: textFieldPrototype.type,
  prototypeId: textFieldPrototype.id,
  ...textFieldPrototype.template,
} as const satisfies TextField;

const paragraphPrototype = {
  id: 'paragraphPrototype',
  type: 'paragraph',
  canBeDeleted: true,
  canBeMoved: true,
  multiple: true,
  cvTemplateId: cvTemplate.id,
  label: 'block.prototype.paragraphPrototype.label',
  template: { childPrototypeIds: [textFieldPrototype.id] },
} as const satisfies BlockPrototype<Paragraph>;

const paragraph = {
  id: 'paragraph',
  type: paragraphPrototype.type,
  prototypeId: paragraphPrototype.id,
  children: [textField],
} as const satisfies Paragraph;

export const MOCK_CV_TEMPLATES = {
  cvTemplate,
};

export const MOCK_BLOCK_PROTOTYPES = {
  cvPrototype,
  textFieldPrototype,
  paragraphPrototype,
};

export const MOCK_CVS = {
  cv,
};

export const MOCK_FIELDS = {
  textField,
};

export const MOCK_PARAGRAPHS = {
  paragraph,
};

export const MOCK_BLOCKS = {
  ...MOCK_CVS,
  ...MOCK_PARAGRAPHS,
  ...MOCK_FIELDS,
};
