import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BANK_ACCOUNTS, RECEIPT_NAMES } from '../url'
import { getData } from '../api'

export const fetchInitialFeeData = createAsyncThunk(
  'data/fetchInitialFeeData',
  async (_, { rejectWithValue }) => {
    try {
      const [bankAccounts, receiptNames] = await Promise.all([
        getData(BANK_ACCOUNTS),
        getData(RECEIPT_NAMES)
      ]) // Replace with your API endpoint
      return {
        bankAccounts: bankAccounts.data.data,
        receiptNames: receiptNames.data.data
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)

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
  extraReducers: (builder) => {
      builder.addCase(fetchInitialFeeData.fulfilled, (state, action) => {
        state.bankAccounts = action.payload.bankAccounts.filter((item) => item.mode ==='online')
        state.receiptNames = action.payload.receiptNames
      })
    },
})

export const {setFee, setExpense, setLoan, setBankAccounts, setReceiptNames} = feeSlice.actions
export default feeSlice.reducer
