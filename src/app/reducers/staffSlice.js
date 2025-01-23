import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staff: [], // List of all exams
    selectedStaff: null, // Stores details of the clicked exam
  },
  reducers: {
    
    selectStaff: (state, action) => {
      state.selectedStaff = action.payload // Set selected exam details
    },
  },
})

export const {selectStaff} = staffSlice.actions
export default staffSlice.reducer
