import type { Cv, TextField } from '@robby-rabbitman/cv-libs-cv-types';

const cv = {
  type: 'cv',
  /** 2025-04-15 */
  createdAt: 1744668000000,
  /** 2025-04-16 */
  lastModifiedAt: 1744754400000,
  id: 'cv-1',
  children: [],
  userId: 'user-1',
  label: 'User 1 CV',
  prototypeId: 'cv-prototype-1',
} satisfies Cv;

const textField = {
  type: 'text',
  id: 'field-1',
  value: 'Some text',
  prototypeId: 'field-prototype-text-1',
} satisfies TextField;

export const MOCK_CVS = {
  cv,
};

export const MOCK_FIELDS = {
  textField,
};

export const MOCK_BLOCKS = {
  ...MOCK_CVS,
  ...MOCK_FIELDS,
};
