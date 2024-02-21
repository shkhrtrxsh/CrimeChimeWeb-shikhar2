import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";
import { setError } from '../reducers/report';


export const addReport = createAsyncThunk(
    "report/add",
    async ({ formValue, navigate }, { rejectWithValue }) => {
      try {
        const response = await API.post("/report", formValue, {headers: {
            'content-type': 'multipart/form-data',
          }});
        if(response.data.status === 200){
          toast.success(response.data.message);
          navigate("/report?target=single&id="+response.data.data.id);
          return response.data;
        }
        toast.error(response.data.message);

      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);


export const editReport = createAsyncThunk(
  "report/edit",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put("/report", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/report/" + formValue.report_module_id);
        return response.data;
      }
      toast.error("Something wrong in report");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getReports = createAsyncThunk(
  "report",
  async ({param, id}, { rejectWithValue,dispatch }) => {
    try {
      const response = await API.get(`/report?${param}`);
      if(response.data.status === 200){
        const allData = response.data.data;
        if(allData.report.data.length===0){
          dispatch(setError(response.data.message));
          return rejectWithValue({message:response.data.message});
        }
        const admin = allData?.admin?true:false;
        const user = (admin&&allData?.user)?allData.user:null;
        return {...allData.report,admin,user} ;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const reportshome = createAsyncThunk(
  "reportshome",
  async ({param, id}, { rejectWithValue }) => {
    try {
      const response = await API.get(`/report?${param}`);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const showReport = createAsyncThunk(
  "report/show",
  async ({ id, by }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/report/show/${id}?by=${by}`);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "report/delete",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete("/report/"+id);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in report");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const get_note = createAsyncThunk(
  "get_note",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await API.get("/report/get_note/"+id);
      if(response.data.status === 200){
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addNote = createAsyncThunk(
  "add_note",
  async ({ formValue, id, navigate }, { rejectWithValue }) => {
    try {
      
      const response = await API.post("report/add_not/"+id, formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        navigate("/reports");
        return response.data;
      }
      toast.error("Something wrong in report");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyToken = createAsyncThunk(
  "verify_token",
  async ({token }, { rejectWithValue }) => {
    try {
      let datatoken = {token: token}
      const response = await API.post("/auth/verify_token", datatoken);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const reportStatus = createAsyncThunk(
  "report/status",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/report/status", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        return response.data;
      }
      toast.error("Something wrong in report");

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const getCrimes = createAsyncThunk(
    "crime",
    async ({}, { rejectWithValue }) => {
      try {
        const response = await API.get(`/crime`);
        if(response.data.status === 200){
          return response.data.data;
        }
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);

export const getSpecificCrimesById = createAsyncThunk(
    "specific-crime-by-id",
    async ({id}, { rejectWithValue }) => {
      try {
        const response = await API.get(`/crime/${id}`);
        if(response.data.status === 200){
          return response.data.data;
        }
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);

export const uploadReportImage = createAsyncThunk(
    "upload report image",
    async ({file}, { rejectWithValue }) => {
      try {
        const response = await API.post(`/report/image-upload`, {file:file}, {headers: {
            'content-type': 'multipart/form-data',
          }});
        if(response.data.status === 200){
          return response.data.data;
        }
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
);

export const getReportByArea = createAsyncThunk(
  "report",
  async ({query}, { rejectWithValue }) => {
    try {
      // console.log(query);
      const response = await API.get(`/report/area?${query}`);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMyReport = createAsyncThunk(
  "report/my",
  async ({query}, { rejectWithValue }) => {
    try {
      const response = await API.get(`/report/my`);
      if(response.data.status === 200){
        try {
          if(response.data.data.data.length===0){
            throw Error(response.data.message);
          }
        } catch (error) {
          return rejectWithValue(error.message);
        }
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getReportPermission = createAsyncThunk(
  "reportPermission",
  async ({query}, { rejectWithValue }) => {
    try {
      const response = await API.get(`/reportPermission`);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const allowAddReport = createAsyncThunk(
  "allowAddReport",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("/allowAddReport", formValue);
      if(response.data.status === 200){
        toast.success(response.data.message);
        // navigate("/report?target=single&id="+response.data.data.id);
        return response.data;
      }
      toast.error(response.data.message);

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const showReportStatus = createAsyncThunk(
  "setShowReport",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/setShowReport", formValue);
      if(response.data.code === 200){
        toast.success(response.data.message);
        return response.data;
      }else{
        toast.error(response.data.message);
      }

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const reportApproved = createAsyncThunk(
  "setReportApproved",
  async ({ formValue }, { rejectWithValue }) => {
    try {
      const response = await API.post("/setReportApproved", formValue);
      if(response.data.code === 200){
        toast.success(response.data.message);
        return response.data;
      }else{
        toast.error(response.data.message);
      }

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);