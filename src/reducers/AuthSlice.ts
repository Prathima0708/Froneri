import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Auth Props
export interface AuthState {
  loading: boolean;
  isAuthenticatedUser: boolean;
  error: string | null;
}

// Initial State 
const initialState: AuthState = {
  loading: false,
  isAuthenticatedUser: false,
  error: null,
};

// Auth Slice - name, initial state & reducer function
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    authBegin: state => {
      state.loading = true;
    },
    authSuccess: (
      state,
      action: PayloadAction<{isAuthenticatedUser: boolean}>,
    ) => {
      state.loading = false;
      state.isAuthenticatedUser = action.payload.isAuthenticatedUser;
      state.error = null;
    },
    authFailure: (
      state,
      action: PayloadAction<{isAuthenticatedUser: boolean}>,
    ) => {
      state.loading = false;
      state.isAuthenticatedUser = action.payload.isAuthenticatedUser;
      state.error = 'AUTH FAILED...';
    },
  },
});

// Extract and export each action creator by name
export const {authBegin, authSuccess, authFailure} = authSlice.actions;
// Export the reducer, either as a default or named export
export default authSlice.reducer;
