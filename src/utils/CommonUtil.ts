import DeviceInfo from 'react-native-device-info';
import {store} from 'src/store';
import base64 from 'react-native-base64';
import {v4 as uuid} from 'uuid';
import {Buffer} from 'buffer';
import IBAN from 'iban';

/**
 * Get locale number format
 * @param number
 * @returns locale format number
 */
export const getLocaleNumberFormatter = (number: number, decimals?: number) => {
  if (number == 0) return 0;
  const locale = store.getState().userContext.locale;
  const decimal = decimals ? decimals : 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  }).format(Number(number));
};

/**
 * Get locale currency format
 * @param number
 * @returns locale formattor currency nuumber
 */
export const getLocaleCurrencyFormatter = (number = 0, decimals?: number) => {
  if (number == 0) return 0;
  const locale = store.getState().userContext.locale;
  const currency = store.getState().userContext.currency;
  const decimal = decimals ? decimals : 2;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    style: 'currency',
    currency: currency,
  }).format(number);
};

/**
 * Convert UTC to local time
 * @param {date} //UTC YYYY-MM-DD HH:MM:SS.sss
 * return -> local time -> DD-MM-YYYY, HH:MM
 */

export const getUtcToLocalTime = (date: any) => {
  const timeZone = store.getState().userContext.timeZone;
  const newDate = date.replace(' ', 'T');
  const utcDate = new Date(newDate + 'Z');

  let options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: timeZone,
  };

  const dateTime = new Intl.DateTimeFormat('en-GB', options).format(utcDate);
  const splitedDateTime = dateTime.split(',');
  const dateParts = splitedDateTime[0].split('/');
  const formattedDate = dateParts.join('-');
  const timeParts = splitedDateTime[1];

  return {
    date: formattedDate,
    time: timeParts,
  };
};

/**
 * remove leading zero's
 */
export const removeLeadingZeroes = (value: string) => {
  let strValue = value.toString();
  return strValue.replace(/^0+/, '');
};

/**
 * Get today's date
 * @returns ISO date -> YYYY-MM-DD HH:MM:SS.sss(YYYY-MM-DD 00:00:00.000)
 */
export const getISOTodaysStartDate = () => {
  let today = new Date();
  let isoTodaysStartDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');
  return isoTodaysStartDate;
};

/**
 * Get today's date
 * @returns ISO date -> YYYY-MM-DD HH:MM:SS.sss(YYYY-MM-DD 23:59:59.000)
 */
export const getISOTodaysEndDate = () => {
  let today = new Date();
  let isoTodaysEndDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
  )
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');
  return isoTodaysEndDate;
};

/**
 * Get date time
 * @returns date time -> YYYY-MM-DD HH:MM:SS.sss(YYYY-MM-DD HH:MM:SS.000)
 */
export const getDateTime = (date: Date) => {
  let isoDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

  return isoDate;
};

/**
 * Get today's date
 * @returns ISO date -> YYYY-MM-DD HH:MM:SS.sss(YYYY-MM-DD 23:59:59.000)
 */
export const getISOCurrentDate = () => {
  let today = new Date();
  let isoTodaysEndDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
    today.getMilliseconds(),
  )
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');
  return isoTodaysEndDate;
};

/**
 * Get current date time
 * @returns ISO date -> yyMMddHHmm format
 */
export const getCurrentTimeForId = () => {
  const date = new Date(getISOCurrentDate());
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return year + month + day + hours + minutes;
};

/**
 * Get week spans two months or not
 * @returns Month with Year -> MMM YYYY-MMM YYY
 */
export const getWeekMonthRange = (date: any) => {
  // Get the start and end of the week containing the given date
  let weekStart = new Date(date);
  weekStart.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  let weekEnd = new Date(date);
  weekEnd.setDate(date.getDate() - ((date.getDay() + 6) % 7) + 5);

  // Check if the week spans two months
  if (weekStart.getMonth() !== weekEnd.getMonth()) {
    return `${weekStart.toLocaleString('default', {
      month: 'short',
    })} ${weekStart.getFullYear()}-${weekEnd.toLocaleString('default', {
      month: 'short',
    })} ${weekEnd.getFullYear()}`;
  } else {
    // Check if the week is in the current month
    let today = new Date();
    if (
      weekStart.getMonth() === today.getMonth() &&
      weekEnd.getMonth() === today.getMonth() &&
      weekStart.getFullYear() === today.getFullYear()
    ) {
      return `${date.toLocaleString('default', {
        month: 'short',
      })} ${date.getFullYear()}`;
    } else {
      return `${weekStart.toLocaleString('default', {
        month: 'short',
      })} ${weekStart.getFullYear()}`;
    }
  }
};

/**
 * Get Day and Month
 * @returns Month with Year -> DD MMM
 */
export const getDateMonth = (date: any) => {
  return `${date.getDate()} ${date.toLocaleString('default', {
    month: 'short',
  })}`;
};

/**
 * Formats the date
 * @returns YYYY-MM-DD
 */
export const formatDate = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats the date
 * @returns DD-MM-YYYY
 */
export const formatDateReverse = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

/**
 * Get only date
 * @returns DD-MM-YYYY
 */
export const getOnlyDate = (date: string) => {
  const originalDateString = date;
  const dateObject = new Date(originalDateString);
  const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  const formattedDate = dateObject
    .toLocaleDateString('en-GB', options)
    .replace(/\//g, '-');
  return formattedDate;
};

/**
 * Returns date with month name (01 January 2023)
 * @returns
 */
export const getDateWithMonthName = (date: string) => {
  const dateObj = new Date(date);
  const options = {day: '2-digit', month: 'long', year: 'numeric'};
  const formattedDate = dateObj.toLocaleDateString('en-GB', options);

  return formattedDate;
};

export const getOnlyTimeFromUTCDate = (time: any) => {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getOnlyTime = (date: string) => {
  const timeParts = date.split(' ')[1].split(':');
  return timeParts[0] + ':' + timeParts[1]; // "08:00"
};

export const getDuration = (start: string, end: string) => {
  const startTime: any = new Date(start);
  const endTime: any = new Date(end);

  const durationInMinutes = (endTime - startTime) / 1000 / 60;

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.round(durationInMinutes % 60);

  let durationFormatted;
  if (hours === 0 && minutes === 0) {
    durationFormatted = '';
  } else if (hours === 0) {
    durationFormatted = `${minutes}m`;
  } else if (minutes === 0) {
    durationFormatted = `${hours}h`;
  } else {
    durationFormatted = `${hours}h ${minutes}m`;
  }

  return durationFormatted;
};

export const checkPassedVisit = (visitDate: string) => {
  const today = new Date();
  const visit = new Date(visitDate);
  return visit < today;
};

// Get App version
export const getAppVersion = () => {
  return DeviceInfo.getVersion();
};

//Get the next 8 days from the current date
export const calculateCalendarDates = (data: any) => {
  const newDates = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(data);
    date.setDate(date.getDate() + i);
    newDates.push(date.toDateString());
  }
  return newDates;
};

// Function to decode the encoded data ..
export const getDecodedData = (data: string) => {
  return base64.decode(data);
};

// Function to get unique id ...
export const getUUID = () => {
  const uuidVal = uuid();
  return uuidVal.toString();
};

// check passed dates or not
export const isPassedDate = (date: string) => {
  // Get the current date (without time)
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  // Get the date you want to compare (in the format "YYYY-MM-DD HH:mm:ss")
  let visit = new Date(date);
  visit.setHours(0, 0, 0, 0); // Set time to midnight
  return visit < today;
};

// get date long string -> Monday / Tuesday/ etc..
export const getDateLongString = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-GB', {weekday: 'long'});
};

/**
 * Validate the email address
 * @returns
 */
export const validateEmail = (email: string) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

/**
 * Validate the string
 * @returns
 */
export const containsOnlyLetters = (str: string) => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(str);
};

/**
 * get server date
 */
export const getServerDate = (date: Date) => {
  const fromDateString = date.toISOString();
  return fromDateString.replace('T', ' ').replace('Z', '');
};

/**
 * Function to convert base64 to binary
 */
export const base64ToBinary = async (base64String: string) => {
  const binaryData = Buffer.from(base64String, 'base64');
  return new Uint8Array(binaryData);
};

/**
 * Function to convert binary to base64
 */
export const binaryToBase64 = (binaryData: any) => {
  const base64String = Buffer.from(binaryData).toString('base64');
  return base64String;
};

/**
 * @returns Function returns date time -> DD-MM-YYYY, HH:MM:SS AM/PM
 */
export const getDateTimeIn12HourFormat = (inputDateTime: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = new Date(inputDateTime).toLocaleString(
    'en-GB',
    options,
  );
  return formattedDate.replaceAll('/', '-');
};

/**
 * @returns Function returns unique id with time -> 99YYMMDDHHSSMMM
 */
export const generateUniqueIdWithTime = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const millisecond = String(now.getMilliseconds()).padStart(3, '0');

  const uniqueId = `99${year}${month}${day}${hour}${second}${millisecond}`;
  return uniqueId;
};

/**
 * @returns Function returns unique id with time -> YYMMDDHHSSMMM
 */
export const generateUniqueIdWithTimeWithoutPrefix = (): string => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const millisecond = String(now.getMilliseconds()).padStart(3, '0');

  const id = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;

  return id;
};

export const validateIBAN = (iban: string) => {
  if (IBAN.isValid(iban)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Validate Single Dot
 * @returns
 */
export const allowOnlyOneDot = (text: string) => {
  const regex = /^[0-9]*\.?[0-9]*$/;
  return regex.test(text);
};

/**
 * Calculates a future date by adding a specified number of weekdays (excluding weekends) to a given start date.
 *
 * @param startDate The starting date from which weekdays will be added.
 * @param numWeekdays The number of weekdays to be added.
 * @returns A Date object representing the future date after adding the specified weekdays.
 */
export const addWeekdays = (startDate: Date, numWeekdays: number): Date => {
  const dayMs = 24 * 60 * 60 * 1000; // milliseconds in a day

  let currentDate = new Date(startDate.getTime()); // Clone the startDate
  let weekdaysAdded = 0;

  while (weekdaysAdded < numWeekdays) {
    currentDate.setTime(currentDate.getTime() + dayMs);

    // Check if the current day is a weekday (Mon-Fri)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      weekdaysAdded++;
    }
  }

  return currentDate;
};

export const mobileRegex = /^[0-9+\- ]+$/;

export const getCurrentDateAndTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
