import { createSlice } from '@reduxjs/toolkit';
import { 
  addReport, 
  getReports, 
  reportStatus, 
  deleteReport, 
  showReport, 
  editReport,
  getCrimes,
  getSpecificCrimesById,
  getReportByArea,
  getMyReport
} from '../api/report'

const initialState = {
    reports: {
      data : null,
      total : 1,
      per_page : 1,
      current_page : 1
    },
    report: null,
    crime_list:null,
    specific_crime_list : null,    
    error: "",
    loading: false,
}

export const report = createSlice({
    name: 'report',
    initialState ,
    reducers:{
      setError:(state,action)=>{
        state.error=action.payload;
        if(action.payload)state.reports=null;
      }
    },
    extraReducers: {
        // Report Add Api
        [addReport.pending]: (state, action) => {
          state.loading = true;
        },
        [addReport.fulfilled]: (state, action) => {
          state.loading = false;
          state.report = action.payload;
        },
        [addReport.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Get Report Api
        [getReports.pending]: (state, action) => {
          state.loading = true;
        },
        [getReports.fulfilled]: (state, action) => {
          state.loading = false;
          state.reports = action.payload;
        },
        [getReports.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
          state.reports=null;
        },

        // Show Report Api
        [showReport.pending]: (state, action) => {
          state.loading = true;
        },
        [showReport.fulfilled]: (state, action) => {
          state.loading = false;
          state.report = action.payload.data;
        },
        [showReport.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Edit Report Api
        [editReport.pending]: (state, action) => {
          state.loading = true;
        },
        [editReport.fulfilled]: (state, action) => {
          state.loading = false;
          // state.report = action.payload.data;
        },
        [editReport.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.report=[];
        },

        // Change Report Status Api
        [reportStatus.pending]: (state, action) => {
          state.loading = true;
        },
        [reportStatus.fulfilled]: (state, action) => {
          state.loading = false;
          state.reports.data.forEach((report, index) => {
            if(report.id === action.payload.data.id){
              state.reports.data[index].status = action.payload.data.status;
            }
          })
        },
        [reportStatus.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Delete Report Api
        [deleteReport.pending]: (state, action) => {
          state.loading = true;
        },
        [deleteReport.fulfilled]: (state, action) => {
          state.loading = false;
          state.reports.data.forEach((report, index) => {
            if(report.id === action.payload.data.id){
              state.reports.data.splice(index, 1)
            }
          })
        },
        [deleteReport.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },


        // Show Report Api
        [getCrimes.pending]: (state, action) => {
            state.loading = true;
        },
        [getCrimes.fulfilled]: (state, action) => {
            state.loading = false;
            state.crime_list = String(action.payload);
        },
        [getCrimes.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        
        // Show Report Api
        [getSpecificCrimesById.pending]: (state, action) => {
            state.loading = true;
        },
        [getSpecificCrimesById.fulfilled]: (state, action) => {
            state.loading = false;
            state.specific_crime_list = action.payload;
        },
        [getSpecificCrimesById.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

        // Get Report Api
        [getReportByArea.pending]: (state, action) => {
          state.loading = true;
        },
        [getReportByArea.fulfilled]: (state, action) => {
          state.loading = false;
          state.reports = action.payload;
        },
        [getReportByArea.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },

        // Get Report Api
        [getMyReport.pending]: (state, action) => {
          state.loading = true;
        },
        [getMyReport.fulfilled]: (state, action) => {
          state.loading = false;
          state.reports = action.payload;
        },
        [getMyReport.rejected]: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        
    }
})

export const {setError} = report.actions;
export default report.reducer;
