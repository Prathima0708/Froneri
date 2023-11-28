import i18next from 'i18next';
export const i18nextFormatter = (key: string, obj?: {}) => {
  return i18next.t(key, obj);
};
export const dateFormatter = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale).format(date);
};

export const numberFormatter = (number = 0, locale: string, decimals = 2) => {
  // get the number of decimalplace

  return parseFloat(number).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const intlNumberFormatter = (
  number = 0,
  locale: string,
  decimals = 2,
  //   roundingRule = DEFAULT_ROUNDING_MODE,
) => {
  // let roundedNumber = roundingRule(number);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};
export const currencyFormatter = (
  number = 0,
  locale: string,
  decimals = 2,
  currency: any,
  // roundingRule = DEFAULT_ROUNDING_MODE
) => {
  // let roundedNumber = roundingRule(number);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: 'currency',
    currency: currency ?? 'INR',
  }).format(number);
};
