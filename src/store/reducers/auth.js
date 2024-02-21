import { createSlice } from '@reduxjs/toolkit';
import { login, register, otpVerify } from '../api/auth'

const initialState = {
    user: null,
    _token: null,
    error: "",
    loading: false,
}

export const auth = createSlice({
    name: 'auth',
    initialState ,
    extraReducers: {
        // Login Api
        [login.pending]: (state, action) => {
          state.loading = true;
        },
        [login.fulfilled]: (state, action) => {
          state.loading = false;
          state.user = action.payload;
        },
        [login.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Register API
        [register.pending]: (state, action) => {
          state.loading = true;
        },
        [register.fulfilled]: (state, action) => {
          state.loading = false;
          state.user = action.payload;
        },
        [register.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },

        // otpverify Api
        [otpVerify.pending]: (state, action) => {
          state.loading = true;
        },
        [otpVerify.fulfilled]: (state, action) => {
          state.loading = false;
          localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
          localStorage.setItem("_token", action.payload.access_token);
          state.user = action.payload;
        },
        [otpVerify.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },
    }
})

export default auth.reducer;