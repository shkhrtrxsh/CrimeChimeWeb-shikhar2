import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";


export const addRole = createAsyncThunk(
    "role/add",
    async ({ formValue, navigate }, { rejectWithValue }) => {
      try {
        const response = await API.post("/role", formValue);
        if(response.data.status === 200){
          toast.success(response.data.message);
          navigate("/role");
          return response.data;
        }
        toast.error("Something wrong in role");

      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);


export const editRole = createAsyncThunk(
  "role/edit",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/role", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/role");
        return response.data;
      }
      toast.error("Something wrong in role");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getRoles = createAsyncThunk(
  "role",
  async ({param, navigate}, { rejectWithValue }) => {
    try {
      const response = await API.get("/role?"+param);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showRole = createAsyncThunk(
  "role/show",
  async ({ id, by }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/role/${id}?by=${by}`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/delete",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete("/role/"+id);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in role");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const roleStatus = createAsyncThunk(
  "role/status",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/role/status", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in role");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


