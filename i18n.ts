import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import Languages from './src/lang';
import {LANGUAGES} from 'src/utils/Constant';
const resources = Languages;
//note: don't forgot to import this file in index.js
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: I18nManager.isRTL ? LANGUAGES.HEBREW : LANGUAGES.ENGLISH,
  resources,
  react: {
    useSuspense: false,
  },
});
export default i18next;
