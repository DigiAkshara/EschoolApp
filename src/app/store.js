import { configureStore } from "@reduxjs/toolkit";
import TenantConfigSlice from "./reducers/TenantConfigSlice";
import appConfigSlice from "./reducers/appConfigSlice";
<<<<<<< Updated upstream
import examSlice from "./reducers/examSlice";
import studentSlice from "./reducers/studentSlice";
=======
import examSlice from "./reducers/examSlice"
import classReducer from "./reducers/classSlice"
>>>>>>> Stashed changes

export const store = configureStore({
  reducer: {
    tenant: TenantConfigSlice,
    appConfig:appConfigSlice,
    exams:examSlice,
<<<<<<< Updated upstream
    students:studentSlice
=======
    class: classReducer,
>>>>>>> Stashed changes
  }
})