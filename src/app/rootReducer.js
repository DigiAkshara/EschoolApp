import { combineReducers } from '@reduxjs/toolkit';
import TenantConfigSlice from './reducers/TenantConfigSlice';
import academicSlice from './reducers/academicSlice';
import appConfigSlice, { logout } from './reducers/appConfigSlice';
import attendanceSlice from './reducers/attendanceSlice';
import classReducer from './reducers/classSlice';
import designationReducer from './reducers/designationSlice';
import examSlice from './reducers/examSlice';
import feeSlice from "./reducers/feeSlice";
import holidayReducer from './reducers/holidaySlice';
import staffSlice from './reducers/staffSlice';
import stuFeesReducer from './reducers/stuFeesSlice';
import studentSlice from './reducers/studentSlice';

const appReducer = combineReducers({
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
  designation: designationReducer,
  attendance: attendanceSlice,
});

const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    state = undefined; // Reset the entire store
  }
  return appReducer(state, action);
};

export default rootReducer;
