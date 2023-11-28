import React from 'react';
import {
  RadioGroup,
  RadioButton,
  RadioButtonProps,
  RadioGroupProps,
} from 'react-native-ui-lib';
import Text from 'src/components/Text';
import View from 'src/components/View';
import TextError from 'src/components/TextError';
import {BaseRadioButtonCommonProps} from 'src/interface/component/Input';

type BaseRadioButtonProps = RadioGroupProps &
  RadioButtonProps &
  BaseRadioButtonCommonProps;

const BaseRadioButton: React.FC<BaseRadioButtonProps> = (
  props: BaseRadioButtonProps,
) => {
  const {
    title,
    titleStyle,
    initialValue,
    data,
    errorMsg,
    errorClassName,
    errorStyleObj,
  } = props;

  return (
    <>
      {title ? (
        <Text style={titleStyle ? titleStyle : undefined}>{title}</Text>
      ) : null}

      {data && (
        <RadioGroup initialValue={initialValue ? initialValue : ''} {...props}>
          <View row spread>
            {data.map((item, index) => {
              return (
                <RadioButton
                  {...props}
                  value={item.value}
                  label={item.label}
                  key={index.toString()}
                />
              );
            })}
          </View>
        </RadioGroup>
      )}
      {errorMsg && (
        <TextError
          errorMsg={errorMsg}
          errorClassName={errorClassName}
          errorStyleObj={errorStyleObj}
        />
      )}
    </>
  );
};

export default BaseRadioButton;
