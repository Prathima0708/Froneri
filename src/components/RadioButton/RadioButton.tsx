import React from 'react';
import {useTranslation} from 'react-i18next';
import {tw} from 'src/tw';
import {CHECK_BOX_STYLES} from 'src/styles/baseTheme';
import {checkboxGenerateClasses} from 'src/utils/Util';
import {WrapperRadioButtonProps} from 'src/interface/component/Input';
import BaseRadioButton from 'src/components/base/BaseRadioButton';

const WrapperRadioButton = (props: WrapperRadioButtonProps) => {
  const {
    variant,
    title,
    titleclassName,
    titleStyle,
    labelStyle,
    errorMsg,
    errorClassName,
    errorStyle,
    labelClassName,
    data,
    color,
    size,
    onValueChange,
  } = props;

  // Hook - i18n translation
  const {t} = useTranslation();

  // Generate tailwind classes
  const getClassNames = () => {
    const styleObject = {
      ...CHECK_BOX_STYLES,
    };

    return checkboxGenerateClasses(styleObject, variant);
  };

  // Overwrite any className which passed from screen
  const {titleClasses, errorClasses, labelClasses} = getClassNames();
  const titleClassNames = titleclassName
    ? titleClasses + ' ' + titleclassName
    : titleClasses;
  const labelClassNames = labelClassName
    ? labelClasses + ' ' + labelClassName
    : labelClasses;
  const errorClassNames = errorClassName
    ? errorClasses + ' ' + errorClassName
    : errorClasses;

  return (
    <BaseRadioButton
      {...props}
      onValueChange={onValueChange}
      title={title ? t(title) : ''}
      titleStyle={[tw(titleClassNames), titleStyle]}
      data={data}
      labelStyle={[tw(labelClassNames), labelStyle]}
      color={color ? color : 'blue'}
      size={size ? size : 24}
      style={tw('')}
      errorMsg={errorMsg ? errorMsg : ''}
      errorClassName={errorClassNames}
      errorStyleObj={errorStyle}
    />
  );
};

export default WrapperRadioButton;
