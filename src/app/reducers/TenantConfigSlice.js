import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getData } from '../api'
import { BRANCH } from '../url'


export const fetchTenants = createAsyncThunk(
  'data/fetchTenants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(BRANCH+'?isDefault=true')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)
const tenantSlice = createSlice({
  name: 'Tenant',
  initialState: {
    tenants:[],
    selectedTenant: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateTenant: (state, action) => {
      state.selectedTenant = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false
        state.tenants = action.payload
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { updateTenant } = tenantSlice.actions
export default tenantSlice.reducer
