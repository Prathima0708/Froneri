import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseDatePicker from 'src/components/base/BaseDatePicker';
import { WrapperInputProps } from 'src/interface/component/Input';
import { DATE_PICKER_STYLES } from 'src/styles/baseTheme';
import { tw } from 'src/tw';
import { datePickerGenerateClasses } from 'src/utils/Util';

const WrapperDatePicker = (props: WrapperInputProps) => {
  const {
    label,
    isEditable = true,
    placeholder,
    style,
    variant,
    className,
    labelStyle,
    errorMsg,
    errorClassName,
    errorStyle,
  } = props;

  // Hook - i18n translation
  const { t } = useTranslation();

  // Generate tailwind classes
  const getClassNames = () => {
    const styleObject = {
      ...DATE_PICKER_STYLES,
    };

    return datePickerGenerateClasses(styleObject, variant);
  };

  // Overwrite any className which passed from screen
  const { inputClasses, errorClasses } = getClassNames();
  const inputClassNames = className
    ? inputClasses + ' ' + className
    : inputClasses;

  const errorClassNames = errorClassName
    ? errorClasses + ' ' + errorClassName
    : errorClasses;

  return (
    <BaseDatePicker
      {...props}
      allowFontScaling={false}
      editable={isEditable}
      title={label ? t(label) : ''}
      titleStyle={labelStyle ? labelStyle : undefined}
      placeholder={placeholder ? t(placeholder) : ''}
      placeholderTextColor={''}
      containerStyle={[tw(inputClassNames), style]}
      hideUnderline={true}
      errorMsg={errorMsg ? errorMsg : ''}
      errorClassName={errorClassNames}
      errorStyleObj={errorStyle}
    />
  );
};

export default WrapperDatePicker;
