import { createSlice } from '@reduxjs/toolkit';
import { 
  addRole, 
  getRoles, 
  roleStatus, 
  deleteRole, 
  showRole, 
  editRole
} from '../api/role'

const initialState = {
    roles: {
      data : null,
      total : 1,
      per_page : 1,
      current_page : 1
    },
    role: null,
    error: "",
    loading: false,
}

export const role = createSlice({
    name: 'role',
    initialState ,
    extraReducers: {
        // Role Add Api
        [addRole.pending]: (state, action) => {
          state.loading = true;
        },
        [addRole.fulfilled]: (state, action) => {
          state.loading = false;
          state.role = action.payload;
        },
        [addRole.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Get Role Api
        [getRoles.pending]: (state, action) => {
          state.loading = true;
        },
        [getRoles.fulfilled]: (state, action) => {
          state.loading = false;
          state.roles = action.payload;
        },
        [getRoles.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Show Role Api
        [showRole.pending]: (state, action) => {
          state.loading = true;
        },
        [showRole.fulfilled]: (state, action) => {
          state.loading = false;
          state.role = action.payload.data;
        },
        [showRole.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Edit Role Api
        [editRole.pending]: (state, action) => {
          state.loading = true;
        },
        [editRole.fulfilled]: (state, action) => {
          state.loading = false;
          state.role = action.payload.data;
        },
        [editRole.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Change Role Status Api
        [roleStatus.pending]: (state, action) => {
          state.loading = true;
        },
        [roleStatus.fulfilled]: (state, action) => {
          state.loading = false;
          state.roles.data.forEach((role, index) => {
            if(role.id === action.payload.data.id){
              state.roles.data[index].status = action.payload.data.status;
            }
          })
        },
        [roleStatus.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Delete Role Api
        [deleteRole.pending]: (state, action) => {
          state.loading = true;
        },
        [deleteRole.fulfilled]: (state, action) => {
          state.loading = false;
          state.roles.data.forEach((role, index) => {
            if(role.id === action.payload.data.id){
              state.roles.data.splice(index, 1)
            }
          })
        },
        [deleteRole.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },       
        
    }
})

export default role.reducer;