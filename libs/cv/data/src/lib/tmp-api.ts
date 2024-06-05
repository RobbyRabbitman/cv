import { ENVIRONMENT_INITIALIZER, Provider } from '@angular/core';
import { firestore } from '@cv/common/util';
import {
  BlockPrototype,
  Cv,
  Paragraph,
  RangeField,
  Section,
  TextField,
} from '@cv/types';
import { collection, doc, setDoc } from 'firebase/firestore';

const cv_1_prototype: BlockPrototype<Cv> = {
  canBeDeleted: true,
  templateId: 'cv_1_template',
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
    templateId: 'cv_1_template',
  },
};

const section_1_prototype: BlockPrototype<Section> = {
  canBeDeleted: true,
  templateId: 'cv_1_template',
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
  templateId: 'cv_1_template',
  canBeMoved: true,
  id: 'paragraph_1_prototype',
  label: 'paragraph 1',
  multiple: true,
  type: 'paragraph',
  template: {
    childPrototypeIds: ['field_1_prototype', 'field_2_prototype'],
  },
};

const field_1_prototype: BlockPrototype<TextField> = {
  canBeDeleted: true,
  templateId: 'cv_1_template',
  canBeMoved: true,
  id: 'field_1_prototype',
  label: 'field 1',
  multiple: true,
  type: 'text',
  template: {
    value: 'field 1',
  },
};

const field_2_prototype: BlockPrototype<RangeField> = {
  canBeDeleted: true,
  templateId: 'cv_1_template',
  canBeMoved: true,
  id: 'field_2_prototype',
  label: 'field 2',
  multiple: true,
  type: 'range',
  template: {
    min: 0,
    max: 3,
    value: 0,
  },
};

const cv_1_prototypes = {
  cv_1_prototype,
  section_1_prototype,
  paragraph_1_prototype,
  field_1_prototype,
  field_2_prototype,
};

const cv_1_template_i18n_de_translation = {
  SECTION_1_PROTOTYPE: {
    LABEL: 'Section 1',
    PLACEHOLDER: 'Section 1',
    ADD: {
      LABEL: '{{ label }} hinzufügen',
    },
  },
  PARAGRAPH_1_PROTOTYPE: {
    LABEL: 'Paragraph 1',
    PLACEHOLDER: 'Paragraph 1',
    ADD: {
      LABEL: '{{ label }} hinzufügen',
    },
  },
  FIELD_1_PROTOTYPE: {
    LABEL: 'Text Feld 1',
    PLACEHOLDER: 'Text Feld 1',
  },
  FIELD_2_PROTOTYPE: {
    LABEL: 'Range Feld 2',
    PLACEHOLDER: 'Range Feld 2',
    OPTIONS: {
      0: 'Option 1',
      1: 'Option 2',
      2: 'Option 3',
      3: 'Option 4',
    },
  },
};

export const provideMockData = [
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory: () => {
      const _firestore = firestore();

      return () => {
        const blockPrototype = collection(_firestore, 'blockPrototype');
        const cvTemplate = collection(_firestore, 'cvTemplate');

        setDoc(doc(cvTemplate, 'cv_1_template'), { id: 'cv_1_template' });

        setDoc(
          doc(cvTemplate, 'cv_1_template', 'i18n', 'de'),
          cv_1_template_i18n_de_translation,
        );

        Object.values(cv_1_prototypes).forEach((x) => {
          setDoc(doc(blockPrototype, x.id), x);
        });
      };
    },
  },
] satisfies Provider[];
