import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// SyncStatus Props
export interface SyncStatusProps {
  isInitialSyncDone: boolean;
}

// Initial State
const initialState: SyncStatusProps = {
  isInitialSyncDone: false,
};

// SyncStatus Slice - name, initial state & reducer function
export const syncStatusSlice = createSlice({
  name: 'syncStatus',
  initialState: initialState,
  reducers: {
    updateSyncStatus: (
      state,
      action: PayloadAction<{isInitialSyncDone: boolean}>,
    ) => {
      state.isInitialSyncDone = action.payload.isInitialSyncDone;
    },
  },
});

// Extract and export each action creator by name
export const {updateSyncStatus} = syncStatusSlice.actions;

// Export the reducer, either as a default or named export
export default syncStatusSlice.reducer;
