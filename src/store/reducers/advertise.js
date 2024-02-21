import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    show:false,
}

const advertise = createSlice({
  name: 'advertise',
  initialState,
  reducers: {}
});

export const {} = advertise.actions

export const advertiseReducer = advertise.reducer;