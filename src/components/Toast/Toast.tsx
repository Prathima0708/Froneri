import React from 'react';

import View from 'src/components/View';
import Text from 'src/components/Text';

import { images } from 'src/assets/Images';

import { tw } from 'src/tw';

import { TOAST_TYPE } from 'src/utils/Constant';

export interface ToastComponentProps {
  message?: string;
  status: string;
  duration?: number;
}

const colors = {
  [TOAST_TYPE.SUCCESS]: 'border-light-limeGreen bg-light-green100',
  [TOAST_TYPE.ERROR]: 'border-light-red1 bg-light-red100',
  [TOAST_TYPE.INFO]: 'border-light-infoBorderColor bg-light-infoBgColor',
};

const ToastComponent = (props: ToastComponentProps) => {
  let ToastIcon;
  if (props.status === TOAST_TYPE.SUCCESS) {
    ToastIcon = images.SuccessIcon;
  } else if (props.status === TOAST_TYPE.ERROR) {
    ToastIcon = images.ErrorInfoIcon;
  } else {
    ToastIcon = null;
  }

  return (
    <View style={tw(
      `${colors[props.status]} self-end rounded-md border-l-8 p-3 -mt-30px mr-2`,
    )}>
      <View row spread center>
        <View marginR-v06>{ToastIcon ? <ToastIcon /> : null}</View>
        <Text text13R textBlack>
          {props.message}
        </Text>
      </View>
    </View>
  );
};

export default ToastComponent;
