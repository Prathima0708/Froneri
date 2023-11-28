import {PRIMARY, TOAST_TYPE} from './Constant';
import Toast from 'react-native-toast-message';

interface STYLE_OBJECT {
  primary: object;
  secondary?: object;
  tertiary?: object;
  quaternary?: object;
  error?: object;
  overrideStyle?: object;
  overrideClasses?: string;
  isDisabled?: boolean;
  [key: string]: any; // additional property Allowed (for ternaryStyle or Other)
}

interface ToastProps {
  message: string;
  duration?: number;
}

export const inputGenerateClasses = (
  styleObject: STYLE_OBJECT,
  variant: string = PRIMARY,
) => {
  variant = `${variant.toLowerCase()}`;
  let styleClassObj = styleObject[variant]
    ? styleObject[variant]
    : styleObject[PRIMARY];
  // Input Classes
  const inputClassName = Object.values(styleClassObj.inputtext).join(' ');
  const inputClasses = inputClassName.replace(/\s+/g, ' ').trim();
  // Label Classes
  const labelClassName = Object.values(styleClassObj.label).join(' ');
  const labelClasses = labelClassName.replace(/\s+/g, ' ').trim();
  // Error Classes
  const errorClassName = Object.values(styleClassObj.error).join(' ');
  const errorClasses = errorClassName.replace(/\s+/g, ' ').trim();

  return {inputClasses, labelClasses, errorClasses};
};

export const datePickerGenerateClasses = (
  styleObject: STYLE_OBJECT,
  variant: string = PRIMARY,
) => {
  variant = `${variant.toLowerCase()}`;
  let styleClassObj = styleObject[variant]
    ? styleObject[variant]
    : styleObject[PRIMARY];

  // Input Classes
  const inputClassName = Object.values(styleClassObj.inputtext).join(' ');
  const inputClasses = inputClassName.replace(/\s+/g, ' ').trim();

  // Error Classes
  const errorClassName = Object.values(styleClassObj.error).join(' ');
  const errorClasses = errorClassName.replace(/\s+/g, ' ').trim();

  return {inputClasses, errorClasses};
};

export const checkboxGenerateClasses = (
  styleObject: STYLE_OBJECT,
  variant: string = PRIMARY,
) => {
  variant = `${variant.toLowerCase()}`;
  let styleClassObj = styleObject[variant]
    ? styleObject[variant]
    : styleObject[PRIMARY];

  // Title Classes
  const titleClassName = Object.values(styleClassObj.title).join(' ');
  const titleClasses = titleClassName.replace(/\s+/g, ' ').trim();
  // Label Classes
  const labelClassName = Object.values(styleClassObj.label).join(' ');
  const labelClasses = labelClassName.replace(/\s+/g, ' ').trim();
  // Error Classes
  const errorClassName = Object.values(styleClassObj.error).join(' ');
  const errorClasses = errorClassName.replace(/\s+/g, ' ').trim();

  return {titleClasses, labelClasses, errorClasses};
};

export const buttonGenerateClasses = (
  styleObject: STYLE_OBJECT,
  variant: string = PRIMARY,
) => {
  variant = `${variant.toLowerCase()}`;
  let styleClassObj = styleObject[variant]
    ? styleObject[variant]
    : styleObject[PRIMARY];

  // Title Classes
  const buttonClassName = Object.values(styleClassObj.button).join(' ');
  const buttonClasses = buttonClassName.replace(/\s+/g, ' ').trim();
  // Active Classes
  const buttonActiveClassName = Object.values(styleClassObj.active).join(' ');
  const buttonActiveClasses = buttonActiveClassName.replace(/\s+/g, ' ').trim();
  // Disabled Classes
  const buttonDisabledClassName = Object.values(styleClassObj.disabled).join(
    ' ',
  );
  const buttonDisabledClasses = buttonDisabledClassName
    .replace(/\s+/g, ' ')
    .trim();
  // Label Classes
  const labelClassName = Object.values(styleClassObj.label).join(' ');
  const labelClasses = labelClassName.replace(/\s+/g, ' ').trim();

  return {
    buttonClasses,
    labelClasses,
    buttonActiveClasses,
    buttonDisabledClasses,
  };
};

const accentCharacters: any = {
  ae: ['ä'],
  oe: ['ö'],
  ue: ['ü'],
  e: ['é', 'è', 'ê', 'ë'],
  a: ['à', 'â'],
  u: ['û', 'ü'],
  o: ['ô'],
  i: ['î', 'ï'],
  ss: ['ß'],
};

const reverseAccentCharacters: any = {
  ä: ['ae'],
  ö: ['oe'],
  ü: ['ue', 'u'],
  é: ['e'],
  è: ['e'],
  ê: ['e'],
  ë: ['e'],
  à: ['a'],
  â: ['a'],
  û: ['u'],
  ô: ['o'],
  î: ['i'],
  ï: ['i'],
  ß: ['ss'],
};

const generateReverseAccentString = (str: string) => {
  const combinations = [str, str.toLowerCase()];
  const filteredAccentCharacters: any = {};
  const accentStrings = [];

  // Generate combinations with accents and in lowercase
  for (const key in reverseAccentCharacters) {
    const accentedLetters = reverseAccentCharacters[key];

    if (str.toLowerCase().includes(key)) {
      filteredAccentCharacters[key] = accentedLetters;
      for (const letter of accentedLetters) {
        const combination = str.toLowerCase().replaceAll(key, letter);
        combinations.push(combination);
      }
    }
  }

  accentStrings.push(...combinations);

  // Generating each possible combination with the previous combinations
  for (const key in filteredAccentCharacters) {
    const element = filteredAccentCharacters[key];

    // Iterating over each filtered accent character
    element.forEach((item: any) => {
      // Iterating over each filtered accent character again to generate all possible combinations
      for (const key2 in filteredAccentCharacters) {
        const subElement = filteredAccentCharacters[key2];
        subElement.forEach((subItem: any) => {
          combinations.forEach(combination => {
            const newCombination = combination
              .replace(key, item)
              .replace(key2, subItem);
            accentStrings.push(newCombination);
          });
        });
      }
    });
  }

  const result = [...new Set(accentStrings)];

  return result;
};

export const generateAccentString = (str: string) => {
  const combinations = [str, str.toLowerCase()];
  const filteredAccentCharacters: any = {};
  const accentStrings = [];

  // Generate combinations with accents and in lowercase
  for (const key in accentCharacters) {
    const accentedLetters = accentCharacters[key];

    if (str.toLowerCase().includes(key)) {
      filteredAccentCharacters[key] = accentedLetters;
      for (const letter of accentedLetters) {
        const combination = str.toLowerCase().replaceAll(key, letter);
        combinations.push(combination);
      }
    }
  }

  accentStrings.push(...combinations);

  // Generating each possible combination with the previous combinations
  for (const key in filteredAccentCharacters) {
    const element = filteredAccentCharacters[key];

    // Iterating over each filtered accent character
    element.forEach((item: any) => {
      // Iterating over each filtered accent character again to generate all possible combinations
      for (const key2 in filteredAccentCharacters) {
        const subElement = filteredAccentCharacters[key2];
        subElement.forEach((subItem: any) => {
          combinations.forEach(combination => {
            const newCombination = combination
              .replace(key, item)
              .replace(key2, subItem);
            accentStrings.push(newCombination);
          });
        });
      }
    });
  }

  const reverseAccentStringArray = generateReverseAccentString(str);
  const result = [...new Set([...accentStrings, ...reverseAccentStringArray])];

  return result;
};

export const generateTimeRanges = (
  date: string,
  length: number,
  hour: number,
  mins: number,
  durations: any,
) => {
  const unformattedDate = new Date(date);
  const formattedDate = `${unformattedDate.getFullYear()}-${
    unformattedDate.getMonth() + 1
  }-${unformattedDate.getDate()}`;

  const startTime = new Date(formattedDate);
  startTime.setUTCHours(hour, mins, 0); // Set start time to passed hour and minute time
  const timeRanges = [];

  for (let i = 0; i < length; i++) {
    const endTime = new Date(startTime);
    endTime.setUTCMinutes(endTime.getUTCMinutes() + durations[i]); // Add durations to the start time

    timeRanges.push({
      start: startTime.toISOString().replace('T', ' ').slice(0, -1),
      end: endTime.toISOString().replace('T', ' ').slice(0, -1),
    });

    startTime.setUTCMinutes(startTime.getUTCMinutes() + durations[i]); // Set the start time for the next range
  }

  return timeRanges;
};

const showToast = (status: string, options: ToastProps) => {
  Toast.show({
    type: 'customToast',
    visibilityTime: options?.duration ? options?.duration : 3000,
    autoHide: true,
    props: {
      status,
      message: options?.message,
    },
  });
};

export const toast = {
  success: (options: ToastProps) => {
    showToast(TOAST_TYPE.SUCCESS, options);
  },
  error: (options: ToastProps) => {
    showToast(TOAST_TYPE.ERROR, options);
  },
  info: (options: ToastProps) => {
    showToast(TOAST_TYPE.INFO, options);
  },
};
