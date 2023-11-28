import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// CustomerLanding Props
export interface CustomerLandingState {
  customerInfo: any;
  contactsInfo: any;
  upcomingVisitIdCall: string;
}

// Initial State
const initialState: CustomerLandingState = {
  customerInfo: {},
  contactsInfo: [],
  upcomingVisitIdCall: '',
};

// Customer Landing Slice - name, initial state & reducer function
export const customerLandingSlice = createSlice({
  name: 'customerLanding',
  initialState: initialState,
  reducers: {
    setCustomerInfo: (state, action: PayloadAction<{customerInfo: any}>) => {
      state.customerInfo = action.payload.customerInfo;
    },
    setContactsInfo: (state, action: PayloadAction<{contactsInfo: any}>) => {
      state.contactsInfo = action.payload.contactsInfo;
    },
    setUpcomingVisitIdCall: (
      state,
      action: PayloadAction<{upcomingVisitIdCall: string}>,
    ) => {
      state.upcomingVisitIdCall = action.payload.upcomingVisitIdCall;
    },
    resetCustomerLandingState: () => {
      return initialState;
    },
  },
});

// Extract and export each action creator by name
export const {
  setCustomerInfo,
  setContactsInfo,
  setUpcomingVisitIdCall,
  resetCustomerLandingState,
} = customerLandingSlice.actions;
// Export the reducer, either as a default or named export
export default customerLandingSlice.reducer;
