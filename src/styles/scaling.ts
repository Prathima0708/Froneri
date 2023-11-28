import {
  scale as sizeScale,
  moderateScale,
  verticalScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

export const SCALE_ALGORITHM = {
  MODERATE: moderateScale,
  VERTICAL: verticalScale,
  MODERATE_VERTICAL: moderateVerticalScale,
  SCALE: sizeScale,
};

export const scale = (size: number, scaleAlgorithm?: Function) => {
  const removeScaling = false; //Make true only for dimensions testing
  if (removeScaling) {
    return size;
  } else if (scaleAlgorithm) {
    return scaleAlgorithm(size);
  } else {
    return SCALE_ALGORITHM.MODERATE(size, 0);
  }
};
