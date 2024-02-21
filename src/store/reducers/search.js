import { createSlice } from '@reduxjs/toolkit';
import { 
  searchLocation,
  googleMapSearchLocation
} from '../api/search'

const initialState = {
    search_location: null,
    search_country: null,
    search_state: null,
    search_city: null,
    error: "",
    loading: false,
}

export const search = createSlice({
    name: 'role',
    initialState ,
    extraReducers: {
        // Role Add Api
        [searchLocation.pending]: (state, action) => {
          state.loading = true;
        },
        [searchLocation.fulfilled]: (state, action) => {
          state.loading = false;
          state.search_location = action.payload;
        },
        [searchLocation.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        [googleMapSearchLocation.pending]: (state, action) => {
          state.loading = true;
        },
        [googleMapSearchLocation.fulfilled]: (state, action) => {
          state.loading = false;
          state.search_location = action.payload;
        },
        [googleMapSearchLocation.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },     
        
    }
})

export default search.reducer;