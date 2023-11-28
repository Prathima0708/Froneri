import {Easing} from 'react-native';
import {TransitionSpecs} from '@react-navigation/stack';
const springConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const timingConfig = {
  animation: 'timing',
  config: {
    duration: 1000,
    easing: Easing.bounce,
  },
};
const forFade = ({current}: {current: any}) => ({
  cardStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    }),
  },
  overlayStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
      extrapolate: 'clamp',
    }),
  },
});
const customTransition = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({
    current,
    next,
    layouts,
  }: {
    current: any;
    next: any;
    layouts: any;
  }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            rotate: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '0deg'],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                })
              : 1,
          },
        ],
      },
    };
  },
};
const opacityTransition = {
  gestureDirection: 'vertical', // we will swipe right if we want to close the screen;
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    },
  },
  cardStyleInterpolator: ({current}: {current: any}) => ({
    cardStyle: {
      opacity: current.progress,
    }, // updates the opacity depending on the transition progress value of the current screen
  }),
};

export {
  springConfig,
  timingConfig,
  forFade,
  customTransition,
  opacityTransition,
};
