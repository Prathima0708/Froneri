import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// ProspectLanding Props
export interface ProspectLandingState {
  prospectInfo: any;
}

// Initial State
const initialState: ProspectLandingState = {
  prospectInfo: {},
};

// Prospect Landing Slice - name, initial state & reducer function
export const prospectLandingSlice = createSlice({
  name: 'prospectLanding',
  initialState: initialState,
  reducers: {
    setProspectInfo: (state, action: PayloadAction<{prospectInfo: any}>) => {
      state.prospectInfo = action.payload.prospectInfo;
    },
    resetProspectLandingState: () => {
      return initialState;
    },
  },
});

// Extract and export each action creator by name
export const {setProspectInfo, resetProspectLandingState} =
  prospectLandingSlice.actions;
// Export the reducer, either as a default or named export
export default prospectLandingSlice.reducer;
