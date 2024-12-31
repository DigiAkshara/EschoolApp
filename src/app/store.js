import { configureStore } from "@reduxjs/toolkit";
import TenantConfigSlice from "./reducers/TenantConfigSlice";
import appConfigSlice from "./reducers/appConfigSlice";
import examSlice from "./reducers/examSlice";
import studentSlice from "./reducers/studentSlice";
import classReducer from "./reducers/classSlice"

export const store = configureStore({
  reducer: {
    tenant: TenantConfigSlice,
    appConfig:appConfigSlice,
    exams:examSlice,
    students:studentSlice,
    class: classReducer,

  }
})