import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseButton from 'src/components/base/BaseButton';
import { ButtonProps } from 'src/interface/component/Button';
import {BUTTON_STYLES} from 'src/styles/baseTheme';
import {buttonGenerateClasses} from 'src/utils/Util';

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    buttonClassName,
    buttonStyle,
    label,
    labelClassName,
    labelStyle,
    disabled,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  // Hook - i18n translation
  const {t} = useTranslation();

  const getClassNames = () => {
    const styleObject = {
      ...BUTTON_STYLES,
    };
    return buttonGenerateClasses(styleObject, props.variant);
  };

  const onPressIn = () => {
    setIsPressed(true);
  };
  const onPressOut = () => {
    setIsPressed(false);
  };

  // Overwrite any className which passed from screen
  const {
    buttonClasses,
    labelClasses,
    buttonActiveClasses,
    buttonDisabledClasses,
  } = getClassNames();

  let buttonClassNames = buttonClassName
    ? buttonClasses + ' ' + buttonClassName
    : buttonClasses;
  if (isPressed)
    buttonClassNames = buttonClassNames + ' ' + buttonActiveClasses;
  if (disabled)
    buttonClassNames = buttonClassNames + ' ' + buttonDisabledClasses;
  const labelClassNames = labelClassName
    ? labelClasses + ' ' + labelClassName
    : labelClasses;

  return (
    <BaseButton
      {...props}
      label={label ? t(label) : ''}
      className={buttonClassNames}
      buttonStyle={buttonStyle}
      labelClassName={labelClassNames}
      labelStyle={labelStyle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      loaderColor={'white'}
    />
  );
};

export default Button;
