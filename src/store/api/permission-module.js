import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";


export const addPermissionModule = createAsyncThunk(
    "permission-module/add",
    async ({ formValue, navigate }, { rejectWithValue }) => {
      try {
        const response = await API.post("/permission-module", formValue);
        if(response.data.status === 200){
          toast.success(response.data.message);
          navigate("/permission-module");
          return response.data;
        }
        toast.error("Something wrong in permission-module");

      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);


export const editPermissionModule = createAsyncThunk(
  "permission-module/edit",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/permission-module", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/permission-module");
        return response.data;
      }
      toast.error("Something wrong in permission-module");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getPermissionModules = createAsyncThunk(
  "permission-module",
  async ({param}, { rejectWithValue }) => {
    try {
      const response = await API.get("/permission-module?"+param);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showPermissionModule = createAsyncThunk(
  "permission-module/show",
  async ({ id, by }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/permission-module/${id}?by=${by}`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePermissionModule = createAsyncThunk(
  "permission-module/delete",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete("/permission-module/"+id);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in permission-module");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const permissionModuleStatus = createAsyncThunk(
  "permission-module/status",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/permission-module/status", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in permission-module");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);