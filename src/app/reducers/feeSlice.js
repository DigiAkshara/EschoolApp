import {createSlice} from '@reduxjs/toolkit'

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    selectedFee: null, // Stores details of the clicked student's fees
  },
  reducers: {
    setFee: (state, action) => {
      state.selectedFee = action.payload // Set selected student fee details
    },
  },
})

export const {setFee} = feeSlice.actions
export default feeSlice.reducer
