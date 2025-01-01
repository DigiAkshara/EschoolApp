// src/redux/examSlice.js
import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [], // List of all exams
    selectedStudent: null, // Stores details of the clicked exam
    classes:[]
  },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    selectStudent: (state, action) => {
      state.selectedStudent = action.payload; // Set selected exam details
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
  },
});

export const { setStudents, selectStudent, setClasses } = studentSlice.actions;
export default studentSlice.reducer;
