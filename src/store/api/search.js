import { createAsyncThunk } from '@reduxjs/toolkit';
import  API from "../../config/api";
import { toast } from "react-toastify";
import axios from "axios";

export const searchLocation = createAsyncThunk(
  "search/location",
  async ({param, navigate}, { rejectWithValue }) => {
    try {
      const response = await API.get("/search/location?"+param);
      if(response.data.status === 200){
        return response.data.data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const googleMapSearchLocation = createAsyncThunk(
  "google-map-search/location",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/y/json?input=Paris&types=geocode&key=AIzaSyApoj80RTzWkAIc_eswUmPogeoufErlNaw", { headers : {"Access-Control-Allow-Origin" : "*"}});
      // response.headers({"Access-Control-Allow-Origin" : "*"});
      // if(response.data.status === 200){
        return response.data.data;
      // }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);