import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseInputText from 'src/components/base/BaseInputText';
import { WrapperInputProps } from 'src/interface/component/Input';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

const WrapperInputText = (props: WrapperInputProps) => {
  const {
    label,
    isSecureText,
    isEditable,
    placeholder,
    style,
    keyboardType,
    errorMsg,
    errorStyle,
    floatingPlaceholder,
    title,
    noBorders,
  } = props;

  // Hook - i18n translation
  const { t } = useTranslation();

  return (
    <BaseInputText
      {...props}
      title={title ? t(title) : ''}
      label={label ? t(label) : ''}
      placeholder={placeholder ? t(placeholder) : ''}
      placeholderTextColor={ColourPalette.light.grey2}
      key={'not-centered'}
      autoCapitalize={'none'}
      autoCorrect={false}
      floatingPlaceholder={floatingPlaceholder ? floatingPlaceholder : false}
      allowFontScaling={false}
      secureTextEntry={isSecureText ? true : false}
      readonly={isEditable === false ? true : false}
      style={style}
      keyboardType={keyboardType ? keyboardType : 'default'}
      errorMsg={errorMsg ? errorMsg : ''}
      errorStyleObj={errorStyle ? errorStyle : { color: ColourPalette.light.red10 }}
      isEditable={isEditable === false ? false : true}
      noBorders={noBorders ? noBorders : false}
    />
  );
};

export default WrapperInputText;
