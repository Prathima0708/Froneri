import React from 'react';
import {DateTimePicker, DateTimePickerProps} from 'react-native-ui-lib';
import TextError from 'src/components/TextError';
import View from 'src/components/View';
import {BaseInputCommonProps} from 'src/interface/component/Input';
import {TextInputProps} from 'react-native';

export type BaseInputProps = TextInputProps &
  DateTimePickerProps &
  BaseInputCommonProps;

const BaseDatePicker: React.FC<BaseInputProps> = (props: BaseInputProps) => {
  const {errorMsg, errorClassName, errorStyleObj} = props;
  return (
    <View>
      <DateTimePicker {...props} />
      {errorMsg && (
        <TextError
          errorMsg={errorMsg}
          errorClassName={errorClassName}
          errorStyleObj={errorStyleObj}
        />
      )}
    </View>
  );
};

export default BaseDatePicker;
