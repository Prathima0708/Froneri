import React from 'react';
import {Chip as UIChip} from 'react-native-ui-lib';

class Chip extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <UIChip {...this.props} />;
  }
}

export default Chip;
