import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";


export const addUser = createAsyncThunk(
    "user/add",
    async ({ formValue, navigate }, { rejectWithValue }) => {
      try {
        const response = await API.post("/auth/register", formValue);
        if(response.code == 200){
          toast.success('User save successfully');
          navigate("/user");
        } else {
          toast.error(response.data.message);
        }
        

      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);


export const editUser = createAsyncThunk(
  "user/edit",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/user", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/user");
        return response.data;
      }
      toast.error("Something went wrong");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("/user/update", formValue, {headers: {
        'content-type': 'multipart/form-data',
      }});
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/profile");
        return response.data;
      }
      toast.error("Something went wrong");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUsers = createAsyncThunk(
  "user",
  async ({param}, { rejectWithValue }) => {
    try {
      const response = await API.get("/user?"+param);
      if(response.data.status === 200){        
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showUser = createAsyncThunk(
  "user/show",
  async ({ id, by }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/user/${id}?by=${by}`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showAuthUser = createAsyncThunk(
  "user/show/auth",
  async ({}, { rejectWithValue}) => {
    try {
      const response = await API.get(`/user/auth`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete("/user/"+id);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something went wrong");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const userStatus = createAsyncThunk(
  "user/status",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/user/status", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something went wrong");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "user/update-address",
  async ({ value, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/user/update-address", value);
      if(response.data.status === 200){
        toast.success(response.data.message);
        // navigate("/profile");
        return response.data;
      }
      toast.error("Something went wrong");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const dashboard = createAsyncThunk(
  "dashboard",
  async ({}, { rejectWithValue}) => {
    try {
      const response = await API.get(`/dashboard`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateSingleAddress = createAsyncThunk(
  "updateAddress",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("/updateAddress", formValue, {headers: {
        'content-type': 'multipart/form-data',
      }});
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/my-addresses");
        return response.data;
      }
      toast.error("Something went wrong");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);