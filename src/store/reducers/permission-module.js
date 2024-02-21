import { createSlice } from '@reduxjs/toolkit';
import { 
  addPermissionModule, 
  getPermissionModules, 
  permissionModuleStatus, 
  deletePermissionModule, 
  showPermissionModule, 
  editPermissionModule
} from '../api/permission-module'

const initialState = {
    permissionModules: {
      data : null,
      total : 1,
      per_page : 1,
      current_page : 1
    },
    permissionModule: null,
    error: "",
    loading: false,
}

export const permissionModule = createSlice({
    name: 'permission-module',
    initialState ,
    extraReducers: {
        // PermissionModule Add Api
        [addPermissionModule.pending]: (state, action) => {
          state.loading = true;
        },
        [addPermissionModule.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModule = action.payload;
        },
        [addPermissionModule.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Get PermissionModule Api
        [getPermissionModules.pending]: (state, action) => {
          state.loading = true;
        },
        [getPermissionModules.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModules = action.payload;
        },
        [getPermissionModules.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Show PermissionModule Api
        [showPermissionModule.pending]: (state, action) => {
          state.loading = true;
        },
        [showPermissionModule.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModule = action.payload.data;
        },
        [showPermissionModule.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Edit PermissionModule Api
        [editPermissionModule.pending]: (state, action) => {
          state.loading = true;
        },
        [editPermissionModule.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModule = action.payload.data;
        },
        [editPermissionModule.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Change PermissionModule Status Api
        [permissionModuleStatus.pending]: (state, action) => {
          state.loading = true;
        },
        [permissionModuleStatus.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModules.data.forEach((permissionModule, index) => {
            if(permissionModule.id === action.payload.data.id){
              state.permissionModules.data[index].status = action.payload.data.status;
            }
          })
        },
        [permissionModuleStatus.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Delete PermissionModule Api
        [deletePermissionModule.pending]: (state, action) => {
          state.loading = true;
        },
        [deletePermissionModule.fulfilled]: (state, action) => {
          state.loading = false;
          state.permissionModules.data.forEach((permissionModule, index) => {
            if(permissionModule.id === action.payload.data.id){
              state.permissionModules.data.splice(index, 1)
            }
          })
        },
        [deletePermissionModule.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },       
        
    }
})

export default permissionModule.reducer;