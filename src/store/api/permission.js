import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";


export const addPermission = createAsyncThunk(
    "permission/add",
    async ({ formValue, navigate }, { rejectWithValue }) => {
      try {
        const response = await API.post("/permission", formValue);
        if(response.data.status === 200){
          toast.success(response.data.message);
          navigate("/permission/"+formValue.permission_module_id);
          return response.data;
        }
        toast.error("Something wrong in permission");

      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);


export const editPermission = createAsyncThunk(
  "permission/edit",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/permission", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/permission/" + formValue.permission_module_id);
        return response.data;
      }
      toast.error("Something wrong in permission");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getPermissions = createAsyncThunk(
  "permission",
  async ({param, id}, { rejectWithValue }) => {
    try {
      const response = await API.get(`/permission/${id}?${param}`);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showPermission = createAsyncThunk(
  "permission/show",
  async ({ id, by }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/permission/show/${id}?by=${by}`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "permission/delete",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete("/permission/"+id);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in permission");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const permissionStatus = createAsyncThunk(
  "permission/status",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/permission/status", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in permission");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showRolePermission = createAsyncThunk(
  "role-permission/show",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/role-permission/${id}`);
      if(response.data.status === 200){
        return response.data;
      }
      toast.error("Something wrong in role permission");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateRolePermission = createAsyncThunk(
  "role-permission/update",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.put("/role-permission", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in role permssion");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addMorePermission = createAsyncThunk(
  "permission/add-more",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("/permission/add", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate('/permission')
        return response.data;
      }
      toast.error("Something wrong in role permssion");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);