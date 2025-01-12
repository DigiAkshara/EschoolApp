import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {postData} from '../api'
import {LOGIN} from '../url'

export const userLogin = createAsyncThunk('/login', async (payload) => {
  const response = await postData(LOGIN, payload)
  return response
})
const loginSlice = createSlice({
  name: 'Login',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default loginSlice.reducer
