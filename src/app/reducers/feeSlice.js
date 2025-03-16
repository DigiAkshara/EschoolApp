import {createSlice} from '@reduxjs/toolkit'

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    selectedFee: null, // Stores details of the clicked student's fees
    selectedExpense: null,
    selectedLoan: null,
    bankAccounts:[],
    receiptNames:[]
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
    setBankAccounts: (state, action) => {
      state.bankAccounts = action.payload
    },
    setReceiptNames: (state, action) => {
      state.receiptNames = action.payload
    }
  },
})

export const {setFee, setExpense, setLoan, setBankAccounts, setReceiptNames} = feeSlice.actions
export default feeSlice.reducer
