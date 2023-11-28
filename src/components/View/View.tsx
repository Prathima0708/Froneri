import React from 'react';
import {View as UIView} from 'react-native-ui-lib';

type UIProps = JSX.LibraryManagedAttributes<
  typeof UIView,
  React.ComponentProps<typeof UIView>
>;

export type Props = UIProps & {
  isDarkMode?: boolean;
  style?: Object;
};

class View extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <UIView {...this.props}>{this.props.children}</UIView>;
  }
}

export default View;
