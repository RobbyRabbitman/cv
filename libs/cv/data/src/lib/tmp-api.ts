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
  label: '',
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
  label: '',
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
  label: '',
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
  label: '',
  multiple: true,
  type: 'text',
  template: {
    value: '',
  },
};

const field_2_prototype: BlockPrototype<RangeField> = {
  canBeDeleted: true,
  templateId: 'cv_1_template',
  canBeMoved: true,
  id: 'field_2_prototype',
  label: '',
  multiple: true,
  type: 'range',
  template: {
    min: 0,
    max: 5,
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

const i18n_de_translation_cv_1_template = {
  CV_1_PROTOTYPE: {
    LABEL: 'Cv 1',
    PLACEHOLDER: 'Cv 1',
  },
  SECTION_1_PROTOTYPE: {
    LABEL: 'Kenntnisse und Fähigkeiten',
    PLACEHOLDER: 'Kenntnisse und Fähigkeiten',
    ADD: {
      LABEL: '{{ label }} hinzufügen',
    },
  },
  PARAGRAPH_1_PROTOTYPE: {
    LABEL: 'Kenntnis/Fähigkeit',
    PLACEHOLDER: 'Kenntnis/Fähigkeit',
    ADD: {
      LABEL: '{{ label }} hinzufügen',
    },
  },
  FIELD_1_PROTOTYPE: {
    LABEL: 'Kenntnis/Fähigkeit',
    PLACEHOLDER: 'Kenntnis/Fähigkeit',
  },
  FIELD_2_PROTOTYPE: {
    LABEL: 'Niveau',
    OPTIONS: {
      0: 'Wähle eine Option',
      1: 'Grundkenntnisse',
      2: 'Durchschnittlich',
      3: 'Gut',
      4: 'Sehr gut',
      5: 'Ausgezeichnet',
    },
  },
};

const i18n_de_translation_common = {
  AUTH: {
    SIGN_IN: {
      BUTTON: {
        LABEL: 'Anmelden',
      },
    },
    SIGN_OUT: {
      BUTTON: {
        LABEL: 'Abmelden',
      },
    },
  },
  I18N: {
    LOCALE: {
      SELECT: {
        LABEL: 'Sprache wählen',
      },
    },
  },
  COMMON: {
    FEATURES: {
      SHELL: {
        LOGO: {
          LABEL: '{{ appName }} Startseite',
        },
      },
    },
    THEME: {
      SELECT: {
        LABEL: 'Design',
        OPTIONS: {
          LIGHT: 'Hell',
          DARK: 'Dunkel',
          SYSTEM: 'System',
        },
      },
    },
  },
  CV: {
    OVERVIEW: {
      TITLE: 'Lebensläufe',
    },
    CREATE_BUTTON: {
      LABEL: 'Lebenslauf erstellen',
    },
    DELETE_BLOCK: {
      TEXT: 'Löschen',
      LABEL: '{{ block }} löschen',
    },
    CARD: {
      LAST_MODIFIED_AT:
        'Zuletzt bearbeitet am <time datetime="{{ lastModifiedAtUTC }}">{{ lastModifiedAt }}</time>',
      INPUT: {
        PLACEHOLDER: 'Kein Titel',
        LABEL: 'Lebenslauf Titel',
      },
      PREVIEW: {
        LABEL: 'Lebenslauf bearbeiten',
      },
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
          doc(_firestore, 'i18n', 'de', 'translation', 'common'),
          i18n_de_translation_common,
        );

        setDoc(
          doc(_firestore, 'i18n', 'de', 'translation', 'cv_1_template'),
          i18n_de_translation_cv_1_template,
        );

        Object.values(cv_1_prototypes).forEach((x) => {
          setDoc(doc(blockPrototype, x.id), x);
        });
      };
    },
  },
] satisfies Provider[];
