import {createSlice} from '@reduxjs/toolkit'

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    selectedFee: null, // Stores details of the clicked student's fees
    selectedExpense: null,
    selectedLoan: null
  },
  reducers: {
    setFee: (state, action) => {
      state.selectedFee = action.payload // Set selected student fee details
    },
    setExpense: (state, action) => {
      state.selectedExpense = action.payload
    },
    setLoan: (state, action) => {
      state.selectedLoan = action.payload
    },
  },
})

export const {setFee, setExpense, setLoan} = feeSlice.actions
export default feeSlice.reducer
