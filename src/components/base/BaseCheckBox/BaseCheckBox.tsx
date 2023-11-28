import React from 'react';
import {Checkbox, CheckboxProps} from 'react-native-ui-lib';
import Text from 'src/components/Text';
import TextError from 'src/components/TextError';
import {BaseCheckBoxCommonProps} from 'src/interface/component/Input';

type BaseCheckBoxProps = CheckboxProps & BaseCheckBoxCommonProps;

const BaseCheckBox: React.FC<BaseCheckBoxProps> = (
  props: BaseCheckBoxProps,
) => {
  const {title, titleStyle, data, errorMsg, errorClassName, errorStyleObj} =
    props;

  return (
    <>
      {title ? (
        <Text style={titleStyle ? titleStyle : undefined}>{title}</Text>
      ) : null}
      {data
        ? data.map(item => (
            <Checkbox {...props} {...item} key={item.label} migrate />
          ))
        : null}
      <TextError
        errorMsg={errorMsg}
        errorClassName={errorClassName}
        errorStyleObj={errorStyleObj}
      />
    </>
  );
};

export default BaseCheckBox;
