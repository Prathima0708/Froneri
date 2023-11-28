import {Platform} from 'react-native';

export const BorderRadiuses = {
  br0: 0,
  br10: Platform.OS === 'ios' ? 3 : 2,
  br20: 6,
  br30: Platform.OS === 'ios' ? 9 : 8,
  br40: 12,
  br50: Platform.OS === 'ios' ? 15 : 16,
  br60: 20,
  br100: 999,
};
