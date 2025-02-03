import {configureStore} from '@reduxjs/toolkit'
import TenantConfigSlice from './reducers/TenantConfigSlice'
import appConfigSlice from './reducers/appConfigSlice'
import tenantReducer from './reducers/tenantSlice'
import classReducer from './reducers/classSlice'
import examSlice from './reducers/examSlice'
import stuFeesReducer from './reducers/stuFeesSlice'
import studentSlice from './reducers/studentSlice'
import academicSlice from './reducers/academicSlice'
import holidayReducer  from './reducers/holidaySlice'
import staffSlice from './reducers/staffSlice'
import feeSlice from "./reducers/feeSlice";

export const store = configureStore({
  reducer: {
    tenant: TenantConfigSlice,
    appConfig: appConfigSlice,
    exams: examSlice,
    students: studentSlice,
    class: classReducer,
    stuFees: stuFeesReducer,
    academics: academicSlice,
    holiday: holidayReducer,
    staff: staffSlice,
    fees: feeSlice,
    tenantData : tenantReducer,
  },
})
