// src/redux/examSlice.js
import { createSlice } from "@reduxjs/toolkit";

const examSlice = createSlice({
  name: "exams",
  initialState: {
    exams: [], // List of all exams
    selectedExam: null, // Stores details of the clicked exam
  },
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    selectExam: (state, action) => {
      state.selectedExam = action.payload; // Set selected exam details
    },
  },
});

export const { setExams, selectExam } = examSlice.actions;
export default examSlice.reducer;
