import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { designations } from '../../commonComponent/CommonFunctions'

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staff: [], // List of all exams
    selectedStaff: null, // Stores details of the clicked exam
    subjects:[],
    designations:[]
  },
  reducers: {
    
    selectStaff: (state, action) => {
      state.selectedStaff = action.payload // Set selected exam details
    },
    setSubjects:(state,action)=>{
      state.subjects = action.payload
    },
    setDesignations:(state,action)=>{
      state.designations = action.payload
    }
  },
})

export const {selectStaff, setSubjects, setDesignations} = staffSlice.actions
export default staffSlice.reducer
