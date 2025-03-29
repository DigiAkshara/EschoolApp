import { combineReducers } from '@reduxjs/toolkit';
import TenantConfigSlice from './reducers/TenantConfigSlice'
import appConfigSlice,{logout} from './reducers/appConfigSlice'
import tenantReducer from './reducers/tenantSlice'
import classReducer from './reducers/classSlice'
import examSlice from './reducers/examSlice'
import stuFeesReducer from './reducers/stuFeesSlice'
import studentSlice from './reducers/studentSlice'
import academicSlice from './reducers/academicSlice'
import holidayReducer from './reducers/holidaySlice'
import staffSlice from './reducers/staffSlice'
import feeSlice from "./reducers/feeSlice";
import designationReducer from './reducers/designationSlice'
import attendanceSlice from './reducers/attendanceSlice'

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
  tenantData: tenantReducer,
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
