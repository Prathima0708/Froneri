import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Sync Props
export interface SyncState {
  totalFiles: number | null;
  totalFilesImported: number;
  importMessage: string | null;
}

// Initial State
const initialState: SyncState = {
  totalFiles: null,
  totalFilesImported: 0,
  importMessage: null,
};

// Sync Slice - name, initial state & reducer function
export const syncSlice = createSlice({
  name: 'sync',
  initialState: initialState,
  reducers: {
    updateTotalFiles: (state, action: PayloadAction<{totalFiles: number}>) => {
      state.totalFiles = action.payload.totalFiles;
    },
    updateTotalImportedFiles: (
      state,
      action: PayloadAction<{totalFilesImported: number}>,
    ) => {
      state.totalFilesImported = action.payload.totalFilesImported;
    },
    updateImportMessage: (
      state,
      action: PayloadAction<{importMessage: string}>,
    ) => {
      state.importMessage = action.payload.importMessage;
    },
    resetSyncState: () => {
      return initialState;
    },
  },
});

// Extract and export each action creator by name
export const {
  updateTotalFiles,
  updateTotalImportedFiles,
  updateImportMessage,
  resetSyncState,
} = syncSlice.actions;
// Export the reducer, either as a default or named export
export default syncSlice.reducer;
