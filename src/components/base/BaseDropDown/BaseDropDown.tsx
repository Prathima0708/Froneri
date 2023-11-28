import React from 'react';
import {Picker, PickerProps, PickerItemProps} from 'react-native-ui-lib';
import Text from 'src/components/Text';
import TextError from 'src/components/TextError';
import View from 'src/components/View';
import {BaseDropDownCommonProps} from 'src/interface/component/Input';

export type BaseDropDownProps = BaseDropDownCommonProps & PickerProps;

const BaseDropDown: React.FC<BaseDropDownProps> = (
  props: BaseDropDownProps,
) => {
  const {
    pickerLabel,
    labelStyle,
    data,
    errorMsg,
    errorClassName,
    errorStyleObj,
  } = props;
  return (
    <View>
      {pickerLabel ? (
        <Text style={labelStyle ? labelStyle : undefined}>{pickerLabel}</Text>
      ) : null}
      <Picker {...props} migrateTextField migrate>
        {data
          ? data.map((option: PickerItemProps) => (
              <Picker.Item {...option} disabled={option.disabled} />
            ))
          : null}
      </Picker>
      <TextError
        errorMsg={errorMsg}
        errorClassName={errorClassName}
        errorStyleObj={errorStyleObj}
      />
    </View>
  );
};

export default BaseDropDown;
