import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staff: [], // List of all exams
    selectedStaff: null, // Stores details of the clicked exam
    subjects:[]
  },
  reducers: {
    
    selectStaff: (state, action) => {
      state.selectedStaff = action.payload // Set selected exam details
    },
    setSubjects:(state,action)=>{
      state.subjects = action.payload
    }
  },
})

export const {selectStaff, setSubjects} = staffSlice.actions
export default staffSlice.reducer
