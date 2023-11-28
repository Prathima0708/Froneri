import React, {createContext, useState, useEffect} from 'react';
import {ColourPalette as ColourPresets} from 'src/styles/config/ColoursStyles';
import {Colors} from 'react-native-ui-lib';
import {
  LOCAL_STORAGE,
  IS_DARK_MODE,
  PREFERRED_LANGUAGE,
} from 'src/storage/Storage';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import {LANGUAGES, THEME} from 'src/utils/Constant';

type AppProviderProps = {
  theme: string;
  language: string;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  colourPalette: {[key: string]: string};
  setPreferredLanguage: (lang: string) => void;
};
const contextDefaultValues: AppProviderProps = {
  theme: THEME.LIGHT,
  language: LANGUAGES.ENGLISH,
  isDarkMode: false,
  setDarkMode: () => {},
  colourPalette: ColourPresets.light,
  setPreferredLanguage: () => {},
};

export const AppContext = createContext<AppProviderProps>(contextDefaultValues);

const handleRnUiLibTheme = (isDarkMode: boolean) => {
  const themeColor = isDarkMode ? ColourPresets.dark : ColourPresets.light;
  Colors.loadColors({
    ...themeColor,
  });
};
const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState(THEME.LIGHT);
  const isDarkMode = theme === THEME.DARK;
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
  const {i18n} = useTranslation();
  useEffect(() => {
    loadAppConfigStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadAppConfigStatus = async () => {
    let isDark = await LOCAL_STORAGE.getData(IS_DARK_MODE);
    if (isDark != null) {
      handleRnUiLibTheme(isDark === THEME.DARK);
      setTheme(isDark);
    } else {
      handleRnUiLibTheme(isDarkMode);
    }
    let lang = await LOCAL_STORAGE.getData(PREFERRED_LANGUAGE);
    if (lang != null) {
      i18n.changeLanguage(lang);
      setLanguage(lang);
    }
  };
  const setDarkMode = (isDark: boolean) => {
    setTheme(isDark ? THEME.DARK : THEME.LIGHT);
    handleRnUiLibTheme(isDark);
    LOCAL_STORAGE.saveData(IS_DARK_MODE, isDark ? THEME.DARK : THEME.LIGHT);
  };
  const setPreferredLanguage = (lang: string) => {
    i18n
      .changeLanguage(lang)
      .then(async () => {
        I18nManager.forceRTL(i18n.language === LANGUAGES.HEBREW);
        I18nManager.allowRTL(i18n.language === LANGUAGES.HEBREW);
        I18nManager.swapLeftAndRightInRTL(i18n.language === LANGUAGES.HEBREW);
        if (language === LANGUAGES.HEBREW || lang === LANGUAGES.HEBREW) {
          RNRestart.Restart();
        }
        LOCAL_STORAGE.saveData(PREFERRED_LANGUAGE, lang);
        setLanguage(lang);
      })
      .catch(err => {
        console.log('something went wrong while applying RTL', err);
      });
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setDarkMode: isDark => setDarkMode(isDark),
        theme,
        colourPalette: isDarkMode ? ColourPresets.dark : ColourPresets.light,
        language,
        setPreferredLanguage: lang => setPreferredLanguage(lang),
      }}>
      {children}
    </AppContext.Provider>
  );
};
export {AppProvider};
