import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData } from "../api";

export const fetchTenant= createAsyncThunk('/api/tenant', async(tenantId)=> {
  const response= await getData(`/api/tenant/${tenantId}`);
  return response
})
const tenantSlice = createSlice({
  name: "Tenant",
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
})

export default tenantSlice.reducer;