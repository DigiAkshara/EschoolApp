import { createSlice } from "@reduxjs/toolkit";

const tenantSlice = createSlice({
  name: "tenant",
  initialState: null, // Initial state is null
  reducers: {
    setTenant: (state, action) => action.payload, // Store tenant data
    clearTenant: () => null, // Clear tenant data on logout
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
