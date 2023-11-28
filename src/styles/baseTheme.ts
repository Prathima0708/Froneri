// INPUT TEXT BASE THEME CONFIG ....
export const COMMON_INPUT_STYLE = {
  inputtext: {
    inputBorderColor: 'border-light-black',
    inputBorderWidth: 'border-0.5',
    inputTextColor: 'text-light-black',
    inputTextAlign: 'text-left',
    inputMarginRight: '',
    inputMarginLeft: '',
    inputMarginTop: '',
    inputMarginBottom: '',
    inputFontSize: 'text-sm',
    inputPaddingV: 'px-4',
    inputPaddingH: 'py-2',
    inputHeight: 'h-10',
    inputWidth: 'w-full',
    inputBorderRadius: 'rounded-full',
  },
  label: {
    inputTextColor: 'text-light-textColor',
    inputTextAlign: 'text-left',
    inputFontSize: 'text-xs',
    inputPaddingH: 'px-2',
    inputPaddingV: 'py-2',
  },
  error: {
    inputBorderColor: 'border-light-red-700',
    inputTextColor: 'text-light-red-700',
    inputBackgroundColor: 'bg-light-white',
    inputFontSize: '',
    inputPaddingH: 'px-2',
  },
};

// INPUT TEXT VARIANTS
export const INPUT_TEXT_PRIMARY_STYLE = {
  ...COMMON_INPUT_STYLE,
};

export const INPUT_TEXT_SECONDARY_STYLE = {
  ...COMMON_INPUT_STYLE,
  inputtext: {
    ...COMMON_INPUT_STYLE.inputtext,
    inputBorderRadius: 'rounded-none',
    inputPaddingV: 'px-2',
    inputPaddingH: 'py-1',
    inputMarginTop: 'mt-2',
  },
};

export const INPUT_TEXT_TERTIARY_STYLE = {
  ...COMMON_INPUT_STYLE,
  inputtext: {
    ...COMMON_INPUT_STYLE.inputtext,
    inputBorderWidth: 'border-default',
    inputPaddingV: 'px-2',
    inputPaddingH: 'py-1',
    inputMarginTop: 'mt-2',
  },
};

export const INPUT_TEXT_STYLES = {
  primary: INPUT_TEXT_PRIMARY_STYLE,
  secondary: INPUT_TEXT_SECONDARY_STYLE,
  tertiary: INPUT_TEXT_TERTIARY_STYLE,
};

// DATE PICKER VARIANTS ..
export const DATE_PICKER_PRIMARY_STYLE = {
  ...COMMON_INPUT_STYLE,
};

export const DATE_PICKER_SECONDARY_STYLE = {
  ...COMMON_INPUT_STYLE,
  inputtext: {
    ...COMMON_INPUT_STYLE.inputtext,
    inputBorderRadius: 'rounded-none',
    inputPaddingV: 'px-2',
    inputPaddingH: 'py-1',
    inputMarginTop: 'mt-2',
  },
};

export const DATE_PICKER_STYLES = {
  primary: DATE_PICKER_PRIMARY_STYLE,
  secondary: DATE_PICKER_SECONDARY_STYLE,
};

// DROPDOWN VARIANTS ..
export const DROP_DOWN_PRIMARY_STYLE = {
  ...COMMON_INPUT_STYLE,
};

export const DROP_DOWN_SECONDARY_STYLE = {
  ...COMMON_INPUT_STYLE,
  inputtext: {
    ...COMMON_INPUT_STYLE.inputtext,
    inputBorderRadius: 'rounded-none',
    inputPaddingV: 'px-2',
    inputPaddingH: 'py-1',
    inputMarginTop: 'mt-2',
  },
};

export const DROP_DOWN_STYLES = {
  primary: DROP_DOWN_PRIMARY_STYLE,
  secondary: DROP_DOWN_SECONDARY_STYLE,
};

// CHECKBOX BASE THEME CONFIG
export const COMMON_CHECKBOX_STYLE = {
  title: {
    inputTextColor: 'text-light-black',
    inputTextAlign: 'text-left',
    inputFontSize: 'text-lg',
    inputPaddingH: '',
    inputPaddingV: 'py-2',
  },

  label: {
    inputTextColor: 'text-light-textColor',
    inputTextAlign: 'text-left',
    inputFontSize: 'text-xs',
    inputPaddingH: '',
    inputPaddingV: 'py-2',
  },
  error: {
    inputBorderColor: 'border-light-red-700',
    inputTextColor: 'text-light-red-700',
    inputBackgroundColor: 'bg-light-white',
    inputFontSize: '',
    inputPaddingH: 'px-2',
  },
};

// CHECKBOX VARIANTS ..
export const CHECK_BOX_PRIMARY_STYLE = {
  ...COMMON_CHECKBOX_STYLE,
};

export const CHECK_BOX_SECONDARY_STYLE = {
  ...COMMON_CHECKBOX_STYLE,
  title: {
    ...COMMON_CHECKBOX_STYLE.title,
    inputMarginTop: 'mt-2',
  },
};

export const CHECK_BOX_STYLES = {
  primary: CHECK_BOX_PRIMARY_STYLE,
  secondary: CHECK_BOX_SECONDARY_STYLE,
};

// BUTTON BASE THEME CONFIG ....
export const COMMON_BUTTON_STYLE = {
  button: {
    buttonBorderColor: 'border-light-black',
    buttonBorderWidth: 'border-0.5',
    buttonBackgroundColor: 'bg-light-appTheme',
    buttonMarginRight: '',
    buttonMarginLeft: '',
    buttonMarginTop: '',
    buttonMarginBottom: '',
    buttonPaddingV: '',
    buttonPaddingH: '',
    buttonHeight: 'h-10',
    buttonWidth: 'w-full',
    buttonBorderRadius: 'rounded-full',
  },
  label: {
    inputTextColor: 'text-light-white',
    inputTextAlign: '',
    inputFontSize: '',
    inputPaddingH: '',
    inputPaddingV: '',
  },
  active: {
    buttonBackgroundColor: 'bg-light-black',
  },
  disabled: {
    buttonBackgroundColor: 'bg-light-white',
  },
};

// BUTTON VARIANTS ..
export const BUTTON_PRIMARY_STYLE = {
  ...COMMON_BUTTON_STYLE,
};

export const BUTTON_SECONDARY_STYLE = {
  ...COMMON_BUTTON_STYLE,
  button: {
    ...COMMON_BUTTON_STYLE.button,
    buttonBackgroundColor: 'bg-light-black',
  },
};

export const BUTTON_STYLES = {
  primary: BUTTON_PRIMARY_STYLE,
  secondary: BUTTON_SECONDARY_STYLE,
};
