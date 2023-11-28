import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Walkthrough Props
export interface WalkthroughState {
  loading: boolean;
  showApp: boolean;
  isFirstLaunch: boolean;
  error: string | null;
}

// Walkthrough initial state
const initialState: WalkthroughState = {
  loading: false,
  showApp: false,
  isFirstLaunch: true,
  error: null,
};

//Walkthrough Slice - name, initial state & reducer functions
export const walkthroughSlice = createSlice({
  name: 'walkthrough',
  initialState: initialState,
  reducers: {
    walkthroughBegin: state => {
      state.loading = true;
    },
    walkthroughSuccess: (state, action: PayloadAction<{showApp: boolean}>) => {
      state.loading = false;
      state.showApp = action.payload.showApp;
      state.isFirstLaunch = false;
      state.error = null;
    },
    walkthroughFailure: (state, action: PayloadAction<{showApp: boolean}>) => {
      state.loading = false;
      state.showApp = true;
      state.isFirstLaunch = false;
      state.error = 'FAILED TO LOAD WALKTHROUGH..';
    },
  },
});

// Extract and export each action creator by name
export const {walkthroughBegin, walkthroughSuccess, walkthroughFailure} =
  walkthroughSlice.actions;
// Export the reducer, either as a default or named export
export default walkthroughSlice.reducer;
