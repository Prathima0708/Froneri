import React from 'react';
import {Switch as UISwitch} from 'react-native-ui-lib';

const Switch = (props: any) => {
  return <UISwitch width={36} height={20} thumbSize={16} {...props} />;
};

export default Switch;
