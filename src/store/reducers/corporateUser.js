import { createSlice } from '@reduxjs/toolkit';
import { 
  listofcorporate
} from '../api/corporateUser'

const initialState = {
  data: null, // This will hold the fetched data
  loading: 'idle', // You can use 'idle', 'pending', 'succeeded', or 'failed'
  error: "", // Holds any error that occurs during the API call
};

export const listcorporatedata = createSlice({
  name: 'listcorporatedata',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(listofcorporate.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(listofcorporate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.data = action.payload;
      })
      .addCase(listofcorporate.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default listcorporatedata.reducer;

// export const { setData } = listcorporate.actions;
// export default listcorporate.reducer;

// const initialState = {
//     users: {
//         data : null,
//         total : 1,
//         per_page : 1,
//         current_page : 1
//     },
//     user: null,
//     error: "",
//     loading: false,
// }

// export const user = createSlice({
//     name: 'user',
//     initialState ,
//     extraReducers: {
//         // User Add Api
//         [addUser.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [addUser.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.user = action.payload;
//         },
//         [addUser.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Get User Api
//         [getUsers.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [getUsers.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.users = action.payload;
//         },
//         [getUsers.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Show User Api
//         [showUser.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [showUser.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.user = action.payload.data;
//         },
//         [showUser.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Show User Api
//         [showAuthUser.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [showAuthUser.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.user = action.payload.data;
//         },
//         [showAuthUser.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Edit User Api
//         [editUser.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [editUser.fulfilled]: (state, action) => {
//           state.loading = false;
//           // state.user = action.payload.data;
//         },
//         [editUser.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Change User Status Api
//         [userStatus.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [userStatus.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.users.data.forEach((user, index) => {
//             if(user.id === action.payload.data.id){
//               state.users.data[index].status = action.payload.data.status;
//             }
//           })
//         },
//         [userStatus.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },

//         // Delete User Api
//         [deleteUser.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [deleteUser.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.users.data.forEach((user, index) => {
//             if(user.id === action.payload.data.id){
//               state.users.data.splice(index, 1)
//             }
//           })
//         },
//         [deleteUser.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },


//         //dashboard Api
//         [dashboard.pending]: (state, action) => {
//           state.loading = true;
//         },
//         [dashboard.fulfilled]: (state, action) => {
//           state.loading = false;
//           state.user = action.payload.data;
//         },
//         [dashboard.rejected]: (state, action) => {
//           state.loading = false;
//           state.error = action.payload.message;
//         },
        
//     }
// })

// export default user.reducer;