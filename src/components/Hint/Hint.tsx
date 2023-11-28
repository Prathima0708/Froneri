import React from 'react';
import {Hint as UIHint} from 'react-native-ui-lib';

const Hint = (props: any) => {
  return <UIHint {...props}>{props.children}</UIHint>;
};

export default Hint;
