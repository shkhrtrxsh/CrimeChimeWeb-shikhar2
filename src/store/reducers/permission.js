import { createSlice } from '@reduxjs/toolkit';
import { 
  addPermission, 
  getPermissions, 
  permissionStatus, 
  deletePermission, 
  showPermission, 
  editPermission,
  showRolePermission
} from '../api/permission'

const initialState = {
    permissions: {
        data : null,
        total : 1,
        per_page : 1,
        current_page : 1
    },
    permission: null,
    error: "",
    loading: false,
}

export const permission = createSlice({
    name: 'permission',
    initialState ,
    extraReducers: {
        // Permission Add Api
        [addPermission.pending]: (state, action) => {
          state.loading = true;
        },
        [addPermission.fulfilled]: (state, action) => {
          state.loading = false;
          state.permission = action.payload;
        },
        [addPermission.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Get Permission Api
        [getPermissions.pending]: (state, action) => {
          state.loading = true;
        },
        [getPermissions.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissions = action.payload;
        },
        [getPermissions.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Show Permission Api
        [showPermission.pending]: (state, action) => {
          state.loading = true;
        },
        [showPermission.fulfilled]: (state, action) => {
          state.loading = false;
          state.permission = action.payload.data;
        },
        [showPermission.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Edit Permission Api
        [editPermission.pending]: (state, action) => {
          state.loading = true;
        },
        [editPermission.fulfilled]: (state, action) => {
          state.loading = false;
          // state.permission = action.payload.data;
        },
        [editPermission.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Change Permission Status Api
        [permissionStatus.pending]: (state, action) => {
          state.loading = true;
        },
        [permissionStatus.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissions.data.forEach((permission, index) => {
            if(permission.id === action.payload.data.id){
              state.permissions.data[index].status = action.payload.data.status;
            }
          })
        },
        [permissionStatus.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Delete Permission Api
        [deletePermission.pending]: (state, action) => {
          state.loading = true;
        },
        [deletePermission.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissions.data.forEach((permission, index) => {
            if(permission.id === action.payload.data.id){
              state.permissions.data.splice(index, 1)
            }
          })
        },
        [deletePermission.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Show Role Permission Api
        [showRolePermission.pending]: (state, action) => {
          state.loading = true;
        },
        [showRolePermission.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissions.data = action.payload.data;
        },
        [showRolePermission.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        
    }
})

export default permission.reducer;