import {createSlice} from '@reduxjs/toolkit'

const stuFeesSlice = createSlice({
  name: 'stuFees',
  initialState: {
    stuFees: [], // List of all student fees
    selectedStudentFees: null, // Stores details of the clicked student's fees
  },
  reducers: {
    setStuFees: (state, action) => {
      state.stuFees = action.payload // Set the entire list of student fees
    },
    selectStudentFees: (state, action) => {
      state.selectedStudentFees = action.payload // Set selected student fee details
    },
  },
})

export const {setStuFees, selectStudentFees} = stuFeesSlice.actions
export default stuFeesSlice.reducer
