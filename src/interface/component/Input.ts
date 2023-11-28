import {TextInput} from 'react-native';

// TextError Props
export interface InputErrorProps {
  errorMsg?: string;
  errorClassName?: string;
  errorStyleObj?: object;
}

// Label Props
export interface LabelProps {
  label?: string;
  labelClassName?: string;
  labelStyleObj?: object;
}

// Base InputText Props
export interface BaseInputCommonProps extends LabelProps, InputErrorProps {
  style?: Object;
  [key: string]: any;
}

// Wrapper Input Text Props
export interface InputStyleProps {
  inputBorderColor?: string;
  inputTextColor?: string;
  inputBackgroundColor?: string;
  inputFontSize?: string;
  inputPaddingV?: string;
  inputPaddingH?: string;
  marginRight?: string;
  marginLeft?: string;
  marginTop?: string;
  marginBottom?: string;
  inputHeight?: string;
  inputWidth?: string;
  inputBorderWidth?: string;
  inputBorderRadius?: string;
  inputBoxShadow?: string;
  inputDisabledBackgroundColor?: string;
  inputDisabledBorderColor?: string;
  inputPlaceHolderTextColor?: string;
  inputTextAlign?: string;
  inputFocusBorderWidth?: string;
  borderStyle?: () => {};
}
export interface ErrorStyleProps {
  inputErrorFontColor?: string;
  inputErrorTextSize?: string;
}

export interface LabelStyleProps {
  labelFontColor?: string;
  labelFontSize?: string;
}
export interface WrapperInputProps
  extends InputStyleProps,
    ErrorStyleProps,
    LabelStyleProps {
  className?: string;
  style?: object;
  [key: string]: any;
  label?: string;
  labelClassName?: string;
  labelStyle?: object;
  validation?: object;
  variant?: string;
  isEditable?: boolean;
  isSecureText?: boolean;
  errorMsg?: string;
  errorClassName?: string;
  errorStyle?: object;
  ref?: React.Ref<TextInput>;
  title?: string;
  noBorders?: boolean;
}

// Dropdown Props

interface PickerItemProps {
  value: string;
  label: string;
  disabled?: boolean;
}

// BaseDropDown Props
export type BaseDropDownCommonProps = InputErrorProps & {
  data: PickerItemProps[];
  pickerLabel: string;
  labelStyle: object;
  errorMsg: string;
  errorClassName: string;
  errorStyleObj: object;
};

// Wrapper Dropdown props
export type WrapperDropDownProps = WrapperInputProps;

// Base CheckBox Props
export type BaseCheckBoxCommonProps = InputErrorProps & {
  title: string;
  titleStyle: object;
  data: {value: boolean; label: string}[];
};

// Wrapper CheckBox Props
export type WrapperCheckBoxProps = {
  variant?: string;
  title?: string;
  titleclassName?: string;
  titleStyle?: object;
  labelClassName?: string;
  labelStyle?: object;
  errorMsg?: string;
  errorClassName?: string;
  errorStyle?: object;
  data: {value: boolean; label: string}[];
  color?: any;
  size?: number;
};

// Base RadioButton Props
export type BaseRadioButtonCommonProps = InputErrorProps & {
  title: string;
  titleStyle: object;
  data: {value: string; label: string}[];
  labelStyle?: object;
};

// Wrapper RadioButton Props
export type WrapperRadioButtonProps = {
  variant?: string;
  title?: string;
  titleclassName?: string;
  titleStyle?: object;
  labelClassName?: string;
  labelStyle?: object;
  errorMsg?: string;
  errorClassName?: string;
  errorStyle?: object;
  data: {value: string; label: string}[];
  color?: any;
  size?: number;
  onValueChange: (value: any) => void;
};
