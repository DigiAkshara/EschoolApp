import {createSlice} from '@reduxjs/toolkit'

const classSlice = createSlice({
  name: 'class',
  initialState: {
    data: [], // All class data
    selectedClass: null, // Selected class data
  },
  reducers: {
    setClass(state, action) {
      state.data = action.payload // Update class data
    },
    setSelectedClass(state, action) {
      state.selectedClass = action.payload // Store selected class data
    },
  },
})

export const {setClass, setSelectedClass} = classSlice.actions
export default classSlice.reducer
