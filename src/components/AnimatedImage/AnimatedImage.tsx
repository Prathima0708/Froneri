import React from 'react';
import {AnimatedImage as UIAnimatedImage} from 'react-native-ui-lib';

type UIProps = JSX.LibraryManagedAttributes<
  typeof UIAnimatedImage,
  React.ComponentProps<typeof UIAnimatedImage>
>;

export type Props = UIProps & {
  isDarkMode?: boolean;
  style?: Object;
};

class AnimatedImage extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <UIAnimatedImage {...this.props}>{this.props.children}</UIAnimatedImage>
    );
  }
}

export default AnimatedImage;
