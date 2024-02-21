import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import userReducer from './reducers/user'
import roleReducer from './reducers/role'
import permissionReducer from './reducers/permission'
import permissionModuleReducer from './reducers/permission-module'
import searchReducer from './reducers/permission-module'
import reportReducer from './reducers/report'
import { registerReportReducer } from './reducers/registerReport'
import { advertiseReducer } from './reducers/advertise'
import corporateReducer from './reducers/corporate'
import listReducer from './reducers/industrytypelist'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    corporate: corporateReducer,
    role: roleReducer,
    permission: permissionReducer,
    permissionModule: permissionModuleReducer, 
    search: searchReducer,
    report: reportReducer,
    reportRegister:registerReportReducer,
    advertise:advertiseReducer,
    industrytypelist: listReducer,
  },
})