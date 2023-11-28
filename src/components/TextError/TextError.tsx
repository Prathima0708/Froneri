import React from 'react';
import Text from 'src/components/Text';
import { InputErrorProps } from 'src/interface/component/Input';
import { tw } from 'src/tw';
const TextError = (props: InputErrorProps) => {
  const { errorMsg, errorClassName, errorStyleObj } = props;
  return (
    <Text
      {...props}
      red10
      text90R
      marginL-3
      marginT-s06
      style={[
        tw(errorClassName ? errorClassName : ''),
        errorStyleObj ? errorStyleObj : undefined,
      ]}>
      {errorMsg ? errorMsg : ''}
    </Text>
  );
};

export default TextError;
