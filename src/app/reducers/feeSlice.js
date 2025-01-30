import {createSlice} from '@reduxjs/toolkit'

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    selectedFee: null, // Stores details of the clicked student's fees
    selectedExpense: null
  },
  reducers: {
    setFee: (state, action) => {
      state.selectedFee = action.payload // Set selected student fee details
    },
    setExpense: (state, action) => {
      state.selectedExpense = action.payload
    }
  },
})

export const {setFee, setExpense} = feeSlice.actions
export default feeSlice.reducer
