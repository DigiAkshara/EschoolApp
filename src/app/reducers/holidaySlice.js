// holidaySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHoliday: null, // Store the currently selected holiday for editing
};

const holidaySlice = createSlice({
  name: "holiday",
  initialState,
  reducers: {
    setSelectedHoliday(state, action) {
      state.selectedHoliday = action.payload;
    },
    clearSelectedHoliday(state) {
      state.selectedHoliday = null;
    },
  },
});

export const { setSelectedHoliday, clearSelectedHoliday } = holidaySlice.actions;
export default holidaySlice.reducer;
