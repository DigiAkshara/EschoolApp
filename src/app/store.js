import {configureStore} from '@reduxjs/toolkit'
import TenantConfigSlice from './reducers/TenantConfigSlice'
import appConfigSlice from './reducers/appConfigSlice'
import classReducer from './reducers/classSlice'
import examSlice from './reducers/examSlice'
import stuFeesReducer from './reducers/stuFeesSlice'
import studentSlice from './reducers/studentSlice'

export const store = configureStore({
  reducer: {
    tenant: TenantConfigSlice,
    appConfig: appConfigSlice,
    exams: examSlice,
    students: studentSlice,
    class: classReducer,
    stuFees: stuFeesReducer,
  },
})
