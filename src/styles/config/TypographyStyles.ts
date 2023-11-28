import {Platform, TextStyle} from 'react-native';
import {TypographyKeys} from 'src/styles/config/StyleKeys';
import {TypographyItems, WeightsMap} from 'src/styles/config/StyleMap';
import {scale} from 'src/styles/scaling';

export const WEIGHT_TYPES: {[key: string]: TextStyle['fontWeight']} = {
  THIN: '200' as '200',
  LIGHT: '300' as '300',
  REGULAR: '400' as '400',
  MEDIUM:
    parseFloat(Platform.Version as string) >= 11.2
      ? '600'
      : ('500' as '500' | '600'),
  BOLD: '700' as '700',
  HEAVY: '800' as '800',
  BLACK: '900' as '900',
};

export const FONT_FAMILY_WEIGHT_TYPES: {[key: string]: string} = {
  THIN: 'Heebo-Thin',
  LIGHT: 'Heebo-Light',
  REGULAR: 'Heebo-Regular',
  MEDIUM: 'Heebo-Medium',
  BOLD: 'Heebo-Bold',
  HEAVY: 'Heebo-Black',
  BLACK: 'Heebo-Black',
};

export const TextStyles: Record<string, TextStyle> = {
  h1: {
    fontSize: scale(64),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.THIN : undefined,
    lineHeight: scale(76),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Thin',
  },
  h2: {
    fontSize: scale(64),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.THIN : undefined,
    lineHeight: scale(76),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Thin',
  },

  // text48
  text48: {
    fontSize: scale(48),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.REGULAR : undefined,
    lineHeight: Platform.OS === 'ios' ? scale(60) : scale(62),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Regular',
  },

  // text36
  text36: {
    fontSize: scale(36),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.REGULAR : undefined,
    lineHeight: Platform.OS === 'ios' ? scale(43) : scale(46),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Regular',
  },

  // text37
  text37: {
    fontSize: scale(37),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.REGULAR : undefined,
    lineHeight: Platform.OS === 'ios' ? scale(44) : scale(48),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Regular',
  },

  // text28
  text28: {
    fontSize: scale(28),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.HEAVY : undefined,
    lineHeight: scale(32),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Black',
  },

  // text26
  text26: {
    fontSize: scale(26),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.BOLD : undefined,
    lineHeight: scale(32),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Bold',
  },

  // text24
  text24: {
    fontSize: scale(24),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.BOLD : undefined,
    lineHeight: scale(26),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-BOLD',
  },
  // text22
  text22: {
    fontSize: scale(22),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.BOLD : undefined,
    lineHeight: scale(24),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-BOLD',
  },

  // text20
  text20: {
    fontSize: scale(20),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.BOLD : undefined,
    lineHeight: scale(30),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Bold',
  },

  // text18
  text18: {
    fontSize: scale(18),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.BOLD : undefined,
    lineHeight: scale(24),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Bold',
  },

  // text16
  text16: {
    fontSize: scale(16),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.REGULAR : undefined,
    lineHeight: scale(24),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Regular',
  },

  // text14
  text14: {
    fontSize: scale(14),
    fontWeight: WEIGHT_TYPES.THIN,
    lineHeight: scale(20),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Thin',
  },

  // text13
  text13: {
    fontSize: scale(13),
    fontWeight: WEIGHT_TYPES.MEDIUM,
    lineHeight: scale(19),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Medium',
  },

  // text12
  text12: {
    fontSize: scale(12),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.MEDIUM : undefined,
    lineHeight: scale(20),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Medium',
  },

  // text10
  text10: {
    fontSize: scale(10),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.MEDIUM : undefined,
    lineHeight: scale(16),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Medium',
  },

  // text9
  text9: {
    fontSize: scale(9),
    fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES.REGULAR : undefined,
    lineHeight: scale(16),
    fontFamily: Platform.OS === 'ios' ? 'Heebo' : 'Heebo-Regular',
  },
};

const Typography: Partial<TypographyKeys> = {};

TypographyItems.forEach((key: string) => {
  const fontKey = `${key}` as keyof TypographyKeys;
  Typography[fontKey] = {
    ...TextStyles[fontKey],
  };
  for (const [weightKey, weightValue] of Object.entries(WeightsMap)) {
    const fontWeightKey = `${fontKey}${weightValue}` as keyof TypographyKeys;
    if (Platform.OS === 'ios') {
      Typography[fontWeightKey] = {
        ...TextStyles[fontKey],
        fontWeight: Platform.OS === 'ios' ? WEIGHT_TYPES[weightKey] : undefined,
      };
    } else {
      Typography[fontWeightKey] = {
        ...TextStyles[fontKey],
        fontWeight: undefined,
        fontFamily: FONT_FAMILY_WEIGHT_TYPES[weightKey],
      };
    }
  }
});

export {Typography};
