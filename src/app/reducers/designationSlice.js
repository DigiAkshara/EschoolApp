import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  designation: null, // Stores single designation details
  designations: [],  // Stores list of all designations
};

const designationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {
    setDesignationList: (state, action) => {
      state.designations = action.payload; // Stores all designations
    },
    setSelectedDesignation: (state, action) => {
      state.designation = action.payload; // Stores a single designation for editing
    },
    clearSelectedDesignation: (state) => {
      state.designation = null; // Clears selected designation when modal closes
    },
  },
});

export const { setDesignationList, setSelectedDesignation, clearSelectedDesignation } =
  designationSlice.actions;

export default designationSlice.reducer;
