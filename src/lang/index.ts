import DE from './de';
import EN from './en';
import FR from './fr';
import NL from './nl';
import HE from './he';
// add languages with key inside resources ..
const RESOURCES = {
  de: {
    translation: {
      ...DE,
    },
  },
  en: {
    translation: {
      ...EN,
    },
  },
  fr: {
    translation: {
      ...FR,
    },
  },
  nl: {
    translation: {
      ...NL,
    },
  },
  he: {
    translation: {
      ...HE,
    },
  },
};
export default RESOURCES;
