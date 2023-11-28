import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {authenticationDataConfig, languageConfig} from 'src/utils/data';

// UserContext Props
export interface UserContextProps {
  employee: any;
  salesRep: any;
  delegatedEmployee: any;
  employeeTerritory: any;
  delegatedEmployeeIdTerritory: any;
  employeeDelegatedTerritoryStr: string;
  locale: string;
  timeZone: string;
  currency: string;
  isFlightModeEnabled: boolean;
  isDeviceOnline: boolean;
  user: string;
  selectedLanguage: any;
}

// Initial State
const initialState: UserContextProps = {
  employee: [],
  salesRep: [],
  delegatedEmployee: [],
  employeeTerritory: [],
  delegatedEmployeeIdTerritory: [],
  employeeDelegatedTerritoryStr: '',
  locale: 'en',
  timeZone: 'Asia/Kolkata',
  currency: 'EUR',
  isFlightModeEnabled: false,
  isDeviceOnline: false,
  user: authenticationDataConfig[0].label,
  selectedLanguage: languageConfig[0],
};

// UserContext Slice - name, initial state & reducer function
export const userContextSlice = createSlice({
  name: 'userContext',
  initialState: initialState,
  reducers: {
    updateEmployeeObj: (state, action: PayloadAction<{employee: any}>) => {
      state.employee = action.payload.employee;
    },
    updateSalesRepObj: (state, action: PayloadAction<{salesRep: any}>) => {
      state.salesRep = action.payload.salesRep;
    },
    updateDelegatedEmployeeObj: (
      state,
      action: PayloadAction<{delegatedEmployee: any}>,
    ) => {
      state.delegatedEmployee = action.payload.delegatedEmployee;
    },
    updateUserContext: (
      state,
      action: PayloadAction<{
        employee: any;
        salesRep: any;
        delegatedEmployee: any;
        employeeTerritory: any;
        delegatedEmployeeIdTerritory: any;
        employeeDelegatedTerritoryStr: string;
      }>,
    ) => {
      state.employee = action.payload.employee;
      state.salesRep = action.payload.salesRep;
      state.delegatedEmployee = action.payload.delegatedEmployee;
      state.employeeTerritory = action.payload.employeeTerritory;
      state.delegatedEmployeeIdTerritory =
        action.payload.delegatedEmployeeIdTerritory;
      state.employeeDelegatedTerritoryStr =
        action.payload.employeeDelegatedTerritoryStr;
    },
    updateLocale: (
      state,
      action: PayloadAction<{
        locale: string;
        timeZone: string;
        currency: string;
      }>,
    ) => {
      state.locale = action.payload.locale;
      state.timeZone = action.payload.timeZone;
      state.currency = action.payload.currency;
    },
    updateFlightModeState: (
      state,
      action: PayloadAction<{isFlightModeEnabled: boolean}>,
    ) => {
      state.isFlightModeEnabled = action.payload.isFlightModeEnabled;
    },
    updateIsDeviceOnlineState: (
      state,
      action: PayloadAction<{isDeviceOnline: boolean}>,
    ) => {
      state.isDeviceOnline = action.payload.isDeviceOnline;
    },
    updateSelectedUserForSync: (
      state,
      action: PayloadAction<{selectedUserName: string}>,
    ) => {
      state.user = action.payload.selectedUserName;
    },
    updateSelectedLanguage: (
      state,
      action: PayloadAction<{selectedLanguage: any}>,
    ) => {
      state.selectedLanguage = action.payload.selectedLanguage;
    },
  },
});

// Extract and export each action creator by name
export const {
  updateEmployeeObj,
  updateSalesRepObj,
  updateDelegatedEmployeeObj,
  updateUserContext,
  updateLocale,
  updateFlightModeState,
  updateIsDeviceOnlineState,
  updateSelectedUserForSync,
  updateSelectedLanguage
} = userContextSlice.actions;

// Export the reducer, either as a default or named export
export default userContextSlice.reducer;
